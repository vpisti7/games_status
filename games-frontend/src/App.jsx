import { useState } from "react";
import { Button } from "react-bootstrap";

function App() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Token, setToken] = useState(null);
    const [wantContinue, setWantContinue] = useState("both");
    const [finished, setFinished] = useState("dontcare");
    const [gameNameGET, setGameNameGET] = useState("");
    const [gameNamePOST, setGameNamePOST] = useState("");
    const [complete, setComplete] = useState(0);
    const [wantContinuePOST, setWantContinuePOST] = useState("");
    const [gameData, setGameData] = useState([]);

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const userData = {
            email: Email,
            password: Password,
        };
        fetch("http://localhost:8000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                setToken(data.token);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            email: Email,
            password: Password,
        };
        fetch("http://localhost:8000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error(
                        "Authentication failed: Invalid credentials"
                    );
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                setToken(data.token);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleUserDelete = (e) => {
        e.preventDefault();
        const userData = {
            email: Email,
            password: Password,
        };
        fetch("http://localhost:8000/user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error(
                        "Authentication failed: Invalid credentials"
                    );
                }
                if (response.status === 204) {
                    console.log("Success: User deleted");
                    setToken(null);
                    return;
                }
                throw new Error("Failed to delete user due to server error");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleLogOut = () => {
        setToken(null);
    };

    const handleGetAll = () => {
        let link = "http://localhost:8000/games";

        const addParam = (key, value) => {
            const separator = link.includes("?") ? "&" : "?";
            link += `${separator}${key}=${value}`;
        };

        if (finished === "finished") {
            addParam("finished", 1);
        } else if (finished === "notfinished") {
            addParam("finished", 0);
        }

        if (wantContinue === "wantContinue") {
            addParam("wantContinue", 1);
        } else if (wantContinue === "dontwantContinue") {
            addParam("wantContinue", 0);
        }

        console.log(link);

        fetch(link, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Something went wrong on api server!");
            })
            .then((data) => {
                setGameData(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleGetOne = () => {
        fetch(`http://localhost:8000/games/${gameNameGET}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setGameData([data]);
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleCreate = () => {
        const wantCon = wantContinuePOST === "igen" ? true : false;
        const compl = parseInt(complete);
        const gameData = {
            game_name: gameNamePOST,
            completed_percent: compl,
            wantContinue: wantCon,
        };
        fetch("http://localhost:8000/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(gameData),
        })
            .then((response) => {
                console.log("sikeres hozzáadás");
                return response;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleModify = () => {
        const wantCon = wantContinuePOST === "igen" ? true : false;
        const compl = parseInt(complete);
        const gameData = {
            completed_percent: compl,
            wantContinue: wantCon,
        };
        fetch(`http://localhost:8000/games/${gameNamePOST}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(gameData),
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleDelete = () => {
        fetch(`http://localhost:8000/games/${gameNameGET}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
        })
            .then((response) => {
                console.log("sikeres törlés");
                return response;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="App text-center">
                        <div className="row justify-content-center">
                            <h1>Felhasználó Kezelés</h1>
                        </div>
                        <form className="form-group">
                            <input
                                type="text"
                                value={Email}
                                onChange={(e) => handleInputChange(e, setEmail)}
                                placeholder="Email"
                                className="form-control mx-auto w-50 mb-2"
                            />
                            <input
                                type="password"
                                value={Password}
                                onChange={(e) =>
                                    handleInputChange(e, setPassword)
                                }
                                placeholder="Password"
                                className="form-control mx-auto w-50 mb-2"
                            />
                            <Button
                                className="btn btn-primary mb-2 mx-1"
                                onClick={handleRegister}
                            >
                                Regisztráció
                            </Button>
                            <Button
                                className="btn btn-secondary mb-2 mx-1"
                                onClick={handleLogin}
                            >
                                Bejelentkezés
                            </Button>
                            <Button
                                className="btn btn-danger mb-2 mx-1"
                                onClick={handleLogOut}
                            >
                                Kijelentkezés
                            </Button>
                            <Button
                                className="btn btn-danger mb-2 mx-1"
                                onClick={handleUserDelete}
                            >
                                Törlés
                            </Button>
                        </form>
                    </div>
                    <div className="App">
                        <div className="d-flex justify-content-center align-items-center">
                            <h1>App</h1>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="row justify-content-center">
                                            <div className="col-sm-4">
                                                <form className="form-group">
                                                    <label
                                                        htmlFor="finished"
                                                        className="form-check-label"
                                                    >
                                                        Befejezett
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="finished"
                                                        id="finished"
                                                        value="finished"
                                                        checked={
                                                            finished ===
                                                            "finished"
                                                        }
                                                        onChange={(e) =>
                                                            setFinished(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                    <br></br>
                                                    <label
                                                        htmlFor="notfinished"
                                                        className="form-check-label"
                                                    >
                                                        Folyamatban
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="finished"
                                                        id="notfinished"
                                                        value="notfinished"
                                                        checked={
                                                            finished ===
                                                            "notfinished"
                                                        }
                                                        onChange={(e) =>
                                                            setFinished(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                    <br></br>
                                                    <label
                                                        htmlFor="dontcare"
                                                        className="form-check-label"
                                                    >
                                                        Mindkettő
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="finished"
                                                        id="dontcare"
                                                        value="dontcare"
                                                        checked={
                                                            finished ===
                                                            "dontcare"
                                                        }
                                                        onChange={(e) =>
                                                            setFinished(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                </form>
                                            </div>
                                            <div className="col-sm-4">
                                                <form className="form-group">
                                                    <label
                                                        htmlFor="wantContinue"
                                                        className="form-check-label"
                                                    >
                                                        Folytat
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="wantContinue"
                                                        id="wantContinue"
                                                        value="wantContinue"
                                                        checked={
                                                            wantContinue ===
                                                            "wantContinue"
                                                        }
                                                        onChange={(e) =>
                                                            setWantContinue(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                    <br></br>
                                                    <label
                                                        htmlFor="dontwantcontinue"
                                                        className="form-check-label"
                                                    >
                                                        Nem folytat
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="wantContinue"
                                                        id="dontwantcontinue"
                                                        value="dontwantContinue"
                                                        checked={
                                                            wantContinue ===
                                                            "dontwantContinue"
                                                        }
                                                        onChange={(e) =>
                                                            setWantContinue(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                    <br></br>
                                                    <label
                                                        htmlFor="both"
                                                        className="form-check-label"
                                                    >
                                                        Mindkettő
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        name="wantContinue"
                                                        id="both"
                                                        value="both"
                                                        checked={
                                                            wantContinue ===
                                                            "both"
                                                        }
                                                        onChange={(e) =>
                                                            setWantContinue(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="form-check-input"
                                                    />
                                                </form>
                                            </div>
                                            <div className="col-sm-2">
                                                {" "}
                                                <Button
                                                    onClick={handleGetAll}
                                                    className="btn btn-info mt-2"
                                                >
                                                    Játékok
                                                </Button>
                                            </div>
                                            <div className="col-sm-2"></div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <form className="form-group">
                                            <input
                                                type="text"
                                                value={gameNameGET}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        setGameNameGET
                                                    )
                                                }
                                                placeholder="Játék neve"
                                                className="form-control mx-auto w-100 mb-2"
                                            />
                                            <Button
                                                onClick={handleGetOne}
                                                className="btn btn-primary mb-2 mx-1"
                                            >
                                                Játék
                                            </Button>
                                            <Button
                                                onClick={handleDelete}
                                                className="btn btn-danger mb-2 mx-1"
                                            >
                                                Törlés
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <form className="form-group">
                                    <input
                                        type="text"
                                        value={gameNamePOST}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                setGameNamePOST
                                            )
                                        }
                                        placeholder="Játék Neve:"
                                        className="form-control mx-auto w-100 mb-2"
                                    />
                                    <input
                                        type="number"
                                        value={complete}
                                        onChange={(e) =>
                                            handleInputChange(e, setComplete)
                                        }
                                        placeholder="Teljesített %:"
                                        className="form-control mx-auto w-100 mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={wantContinuePOST}
                                        onChange={(e) =>
                                            handleInputChange(
                                                e,
                                                setWantContinuePOST
                                            )
                                        }
                                        placeholder="Folytatni? (igen/nem)"
                                        className="form-control mx-auto w-100 mb-2 mx-1"
                                    />
                                    <Button
                                        onClick={handleModify}
                                        className="btn btn-warning mb-2 mx-1"
                                    >
                                        Módosít
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                        className="btn btn-success mb-2 mx-1"
                                    >
                                        Hozzáad
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <h1>Adatok</h1>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Játék neve</th>
                                <th>Teljesített %</th>
                                <th>Folytatás</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gameData.map((game) => (
                                <tr key={game.id}>
                                    <td>{game.game_name}</td>
                                    <td>{game.completed_percent}%</td>
                                    <td>
                                        {game.wantContinue
                                            ? "Folytatni"
                                            : "Nem folytatni"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;
