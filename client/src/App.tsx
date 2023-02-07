import React, { useState, useEffect } from "react";
import "./App.css";

interface BikeData {
  departure: string;
  return: string;
  departure_station_id: string;
  departure_station_name: string;
  return_station_id: string;
  return_station_name: string;
  covered_distance: string;
  duration: string;
}

interface PaginatedData {
  data: BikeData[];
  page: number;
  pages: number;
}

const BikeList: React.FC = () => {
  const [bikeData, setBikeData] = useState<PaginatedData>();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBikeData = async () => {
      const response = await fetch(
        `http://localhost:3000/bikedata?page=${currentPage}`
      );
      const data = await response.json();
      setBikeData(data);
    };

    fetchBikeData();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE");
  };

  if (!bikeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Departure</th>
            <th>Return</th>
            <th>Departure Station ID</th>
            <th>Departure Station Name</th>
            <th>Return Station ID</th>
            <th>Return Station Name</th>
            <th>Covered Distance (m)</th>
            <th>Duration (s)</th>
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
        {bikeData.page > 1 && (
          <button onClick={() => handlePageChange(1)}>First</button>
        )}
        <button
          disabled={bikeData.page === 1}
          onClick={() => handlePageChange(bikeData.page - 1)}
        >
          ← Previous
        </button>

        {bikeData.page < bikeData.pages && bikeData.page !== bikeData.pages && (
          <div className="pagination-numbers">
            <button
              className={currentPage === bikeData.page ? "current-page" : ""}
            >
              {bikeData.page}
            </button>

            <button onClick={() => handlePageChange(bikeData.page + 1)}>
              {currentPage + 1}
            </button>
            <button onClick={() => handlePageChange(bikeData.page + 2)}>
              {currentPage + 2}
            </button>
            <button onClick={() => handlePageChange(bikeData.page + 3)}>
              {currentPage + 3}
            </button>
          </div>
        )}
        {bikeData.page < bikeData.pages && (
          <button onClick={() => handlePageChange(bikeData.page + 1)}>
            Next →
          </button>
        )}
        {bikeData.page < bikeData.pages && (
          <button onClick={() => handlePageChange(bikeData.pages)}>Last</button>
        )}
      </div>
    </div>
  );
};

export default BikeList;
