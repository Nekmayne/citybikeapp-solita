import React, { useState, useEffect } from "react";
import Loading from "./Loading";

interface StationsData {
  Nimi: string;
  Osoite: string;
  Kaupunki: string;
  Kapasiteet: string;
}

interface PaginatedData {
  data: StationsData[];
  page: number;
  pages: number;
}

const Stations: React.FC = () => {
  const [stationData, setStationData] = useState<PaginatedData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof StationsData>("Nimi");

  useEffect(() => {
    fetchStationData();
  }, [currentPage, sortOrder, sortKey]);

  const fetchStationData = async () => {
    const response = await fetch(
      `http://localhost:3000/stationdata?page=${currentPage}&sortKey=${sortKey}&sortOrder=${sortOrder}`
    );

    const data = await response.json();
    setStationData(data);
  };

  const handlePageChange = (page: number) => {
    if (!stationData) return;
    if (page > stationData.pages) {
      page = stationData.pages;
    }
    setTimeout(() => {
      setCurrentPage(page);
      setStationData(undefined);
    }, 0);
  };

  const handleSort = (key: keyof StationsData) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (!stationData) {
    return <Loading />;
  }

  const sortedData = [...stationData.data].sort((a, b) => {
    if (sortOrder === "asc") {
      if (a[sortKey] < b[sortKey]) return -1;
      if (a[sortKey] > b[sortKey]) return 1;
      return 0;
    } else {
      if (a[sortKey] > b[sortKey]) return -1;
      if (a[sortKey] < b[sortKey]) return 1;
      return 0;
    }
  });

  const pageNumbers = [];
  for (let i = 1; i <= stationData.pages; i++) {
    pageNumbers.push(i);
  }

  const startIndex = currentPage <= 3 ? 0 : currentPage - 3;
  console.log(startIndex);
  const endIndex =
    currentPage === stationData.pages ? stationData.pages : currentPage + 2;
  const pagesToShow = pageNumbers.slice(startIndex, endIndex);

  return (
    <div className="container">
      <h1 className="header">Stations</h1>
      <div className="sort-text">
        <h3>Sort data by clicking header</h3>
      </div>
      <table>
        <thead>
          <tr className="table-headers">
            <th onClick={() => handleSort("Nimi")}>Name </th>
            <th onClick={() => handleSort("Osoite")}>Address</th>
            <th onClick={() => handleSort("Kaupunki")}>City</th>
            <th onClick={() => handleSort("Kapasiteet")}>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data, index) => {
            const Kapasiteet = parseInt(data.Kapasiteet);
            const isValid = !isNaN(Kapasiteet);
            if (!isValid) {
              return null;
            }
            if (data.Kaupunki === " ") {
              return null;
            }
            {
              return (
                <tr key={index}>
                  <td>{data.Nimi}</td>
                  <td>{data.Osoite}</td>
                  <td>{data.Kaupunki}</td>
                  <td>{data.Kapasiteet}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          &laquo;
        </button>
        {currentPage > 4 && (
          <button onClick={() => handlePageChange(currentPage - 3)}>
            {currentPage - 3}
          </button>
        )}
        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "selected" : ""}
          >
            {page}
          </button>
        ))}
        {currentPage < stationData.pages - 3 && (
          <button onClick={() => handlePageChange(currentPage + 3)}>
            {currentPage + 3}
          </button>
        )}
        <button
          disabled={currentPage === stationData.pages}
          onClick={() => handlePageChange(stationData.pages)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Stations;
