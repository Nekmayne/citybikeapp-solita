import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import "./Journeys.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BikeData {
  departure: string;
  return: string;
  departure_station_id: string;
  departure_station_name: string;
  return_station_id: string;
  return_station_name: string;
  covered_distance: string;
  duration: number;
  first: string | number;
}

interface PaginatedData {
  data: BikeData[];
  sortKey: string;
  sortOrder: "asc" | "desc";
  page: number;
  pages: number;
}

const BikeList: React.FC = () => {
  const [bikeData, setBikeData] = useState<PaginatedData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof BikeData>("departure");

  useEffect(() => {
    fetchBikeData();
  }, [currentPage, sortOrder, sortKey]);

  const fetchBikeData = async () => {
    const response = await fetch(
      `http://localhost:3000/bikedata?page=${currentPage}&sortKey=${sortKey}&sortOrder=${sortOrder}`
    );
    const data = await response.json();
    setBikeData(data);
  };

  const handlePageChange = (page: number) => {
    if (!bikeData) return;
    if (page > bikeData.pages) {
      page = bikeData.pages;
    }
    setTimeout(() => {
      setCurrentPage(page);
      setBikeData(undefined);
    }, 0);
  };

  const handleSort = (key: keyof BikeData) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE");
  };

  if (!bikeData) {
    return <Loading />;
  }

  const pageNumbers = [];
  for (let i = 1; i <= bikeData.pages; i++) {
    pageNumbers.push(i);
  }

  const startIndex = currentPage <= 3 ? 0 : currentPage - 3;

  const endIndex =
    currentPage === bikeData.pages ? bikeData.pages : currentPage + 2;
  const pagesToShow = pageNumbers.slice(startIndex, endIndex);

  return (
    <div className="container">
      <h1 className="header">Journeys</h1>
      <div className="sort-text">
        <h3>Sort data by clicking header</h3>
      </div>
      <table>
        <thead>
          <tr className="table-headers">
            <th className="departure" onClick={() => handleSort("departure")}>
              Departure
            </th>
            <th onClick={() => handleSort("return")}>Return</th>
            <th onClick={() => handleSort("departure_station_id")}>
              Departure Station ID
            </th>
            <th onClick={() => handleSort("departure_station_name")}>
              Departure Station Name
            </th>

            <th onClick={() => handleSort("return_station_id")}>
              Return Station ID
            </th>
            <th onClick={() => handleSort("return_station_name")}>
              Return Station Name
            </th>
            <th onClick={() => handleSort("covered_distance")}>
              Covered Distance (m)
            </th>
            <th onClick={() => handleSort("duration")}>Duration (s)</th>
          </tr>
        </thead>
        <tbody>
          {bikeData.data.map((data, index) => {
            {
              const departure = new Date(data.departure);
              const isValid = !isNaN(departure.getTime());
              if (!isValid) {
                return null;
              }

              return (
                <tr key={index}>
                  <td>{formatDate(data.departure)}</td>
                  <td>{formatDate(data.return)}</td>
                  <td>{data.departure_station_id}</td>
                  <td>{data.departure_station_name}</td>
                  <td>{data.return_station_id}</td>
                  <td>{data.return_station_name}</td>
                  <td>{data.covered_distance}</td>
                  <td>{data.duration}</td>
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
          ← First
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
        {currentPage < bikeData.pages - 3 && (
          <button onClick={() => handlePageChange(currentPage + 3)}>
            {currentPage + 3}
          </button>
        )}
        <button
          disabled={currentPage === bikeData.pages}
          onClick={() => handlePageChange(bikeData.pages)}
        >
          Last →
        </button>
      </div>
    </div>
  );
};

export default BikeList;
