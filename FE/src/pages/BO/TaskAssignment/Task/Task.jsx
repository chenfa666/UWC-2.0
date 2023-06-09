import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { COLUMNS } from "./utils/columns";
import axios from "axios";
import AuthService from "../../../authen/AuthService";
import "./form.css";
import data from './data.json';

const Task = (props) => {
  const [ctasks, setCtasks] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const navigate = useNavigate();

  const currentUser = AuthService.getCurrentUser();
  const config = {
    headers: {
      Authorization: "Bearer " + currentUser.access_token,
    },
  };
  useEffect(() => {
    // authenticate current user on fe

    if (!currentUser) {
      return navigate("/signin");
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ctasks`, config)
      .then((res) => {
        const objs = res.data;
        setCtasks(objs);
        //setCtasks(data);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status == 403) {
          return navigate("/signin");
        }
      });

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/collectors`, config)
      .then((res) => {
        const objs = res.data;
        setCollectors(objs.slice(1, 4));
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.status == 403) {
          return navigate("/signin");
        }
      });
  }, []);

  const handleEdit = (collectorID) => {
    const elements = document.querySelectorAll(`.${collectorID}`);
    for (const element of elements) {
      element.style.border = "1px solid #333";
      element.disabled = false;
    }
  };

  const handleSubmit = (collectorID) => {
    const elements = document.querySelectorAll(`.${collectorID}`);
    const obj = {
      range: elements[1].value,
      id: elements[2].value,
      name: elements[3].value,
      listOfMcps: elements[4].value,
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/create-ctask`,
        obj,
        config
      )
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log({ err });
      });

    for (const element of elements) {
      element.style.border = "";
      element.disabled = true;
    }
  };

  return (
    <div>
      <Button variant="success" href="/task-assignment/mcp-assignment">
        Assign to MCPs
      </Button>{" "}
      <Button variant="success" href="/task-assignment/vehicle-assignment">
        Checking & Assigning vehicles
      </Button>{" "}
      <h4>Task</h4>
      {props.isMcp ? (
        <>
          {collectors.map((collector) => {
            return (
              <Form.Group className="form-task">
                <Form.Label>Task ID: </Form.Label>
                <Form.Control
                  placeholder=""
                  disabled
                  className={collector.ID}
                />
                <Form.Label>Range: </Form.Label>
                <Form.Control
                  placeholder=""
                  disabled
                  className={collector.ID}
                />
                <Form.Label>Collector ID: </Form.Label>
                <Form.Control
                  value={collector.ID}
                  disabled
                  className={collector.ID}
                />
                <Form.Label>Collector Name: </Form.Label>
                <Form.Control
                  value={collector.Name}
                  disabled
                  className={collector.ID}
                />
                <Form.Label>List Of MCPs: </Form.Label>
                <Form.Control
                  placeholder=""
                  disabled
                  className={collector.ID}
                />
                <Button
                  variant="success"
                  className="form-btn"
                  onClick={() => handleEdit(collector.ID)}
                >
                  Edit
                </Button>
                <Button
                  variant="success"
                  className="form-btn"
                  onClick={() => handleSubmit(collector.ID)}
                >
                  OK
                </Button>
              </Form.Group>
            );
          })}
        </>
      ) : (
        <>
          {ctasks.map((ctask) => {
            return (
              <Form.Group className="form-task">
                <Form.Label>Task ID: </Form.Label>
                <Form.Control 
                  value={ctask.id}                   
                  disabled
                  className={ctask.id} />
                <Form.Label>Range: </Form.Label>
                <Form.Control
                  value={ctask.Range}
                  disabled
                  className={ctask.id}
                />
                <Form.Label>Collector ID: </Form.Label>
                <Form.Control
                  value={ctask.CollectorID}
                  disabled
                  className={ctask.id}
                />
                <Form.Label>Collector Name: </Form.Label>
                <Form.Control
                  value={ctask.CollectorName}
                  disabled
                  className={ctask.id}
                />
                <Form.Label>List Of MCPs: </Form.Label>
                <Form.Control
                  value={ctask.listOfMcps}
                  disabled
                  className={ctask.id}
                />
                <Form.Label>Vehicle ID: </Form.Label>
                <Form.Control placeholder="V1234" disabled className={ctask.id} />
                <Button
                  variant="success"
                  className="form-btn"
                  onClick={() => handleEdit(ctask.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="success"
                  className="form-btn"
                  onClick={() => handleSubmit(ctask.id)}
                >
                  OK
                </Button>
                <Button
                  variant="success"
                  className="form-btn"
                  onClick={() => props.handleRenderMap(ctask.listOfMcps)}
                >
                  view Route
                </Button>
           
              </Form.Group>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Task;
