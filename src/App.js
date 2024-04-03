import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import Papa from 'papaparse';

const App = () => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSsKpNWaKMg1dbb0-IUCWTFyr30iouEEnkGVUeslF4QX42aMfjA61aOUfGO1S52EQDepcAdC_my4MMm/pub?output=csv")
            .then(response => response.text())
            .then(csvData => {
                const jsonData = Papa.parse(csvData, { header: true }).data;
                const separatedArrays = {};
                jsonData.forEach(obj => {
                    if (!separatedArrays[obj.Category]) {
                        separatedArrays[obj.Category] = [];
                    }
                    separatedArrays[obj.Category].push(obj);
                });
                setData(separatedArrays);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, []);


    return (
        <div className="App">
            <div className="tabs-container">
                {
                    isLoading ? <p>Loading...</p> :
                        error ? <p>{error.message}</p> :
                            <>
                                <div className="tab-buttons">
                                    {Object.keys(data).map((category, index) => (
                                        <button
                                            key={index}
                                            className={index === activeTab ? 'active' : ''}
                                            onClick={() => handleTabClick(index)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                <div className="tab-content">
                                    {Object.keys(data).map((category, index) => (
                                        <div key={index} style={{ display: index === activeTab ? 'block' : 'none' }}>
                                            {data[category].map((item, itemIndex) => (
                                                <div key={itemIndex}>
                                                    <p><span className="alphabet"> {item.Alphabet} </span> - <span className="name"> {item.Name} </span> - {item.Description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </>
                }
            </div>
        </div>
    );
}

export default App;
