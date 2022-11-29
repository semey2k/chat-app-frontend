import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, sendMessageRoute, recieveMessageRoute } from '../utils/APIRoutes';
import ChatInput from '../components/ChatInput';
import { v4 as uuidv4 } from 'uuid';
import Logout from '../components/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';

export default function Chat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setAllUsers] = useState([]);
  const [modalActive, setModalActive] = useState(false);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate('/login');
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
    }
  }, []);

  useEffect(async () => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    const response = await axios.post(recieveMessageRoute, {
      to: data._id,
    });
    setMessages(response.data.filter((el) => el.fromSelf !== true));
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        to: data._id,
      });
      setMessages(response.data.filter((el) => el.fromSelf !== true));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(async () => {
    if (currentUser) {
      const vc = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setAllUsers(vc.data);
    }
  }, [currentUser]);

  const handleSendMsg = async (msg, title, recipient) => {
    const mail = await users.filter((el) => el.username == recipient)[0];
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: mail._id,
      fromUsername: data.username,
      toUsername: mail.username,
      title: title,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, title: title, fromUsername: data.username, message: msg });
    setMessages(msgs.filter((el) => el.fromSelf !== true));
    setModalActive(false);
  };


  return (
    <div style={{ position: 'relative', height: '100vh', overflowY: 'scroll' }}>
      <Header>
        <div
          className="compose-btn"
          onClick={() => (modalActive ? setModalActive(false) : setModalActive(true))}>
          <img
            src="https://www.gstatic.com/images/icons/material/colored_icons/1x/create_32dp.png"
            alt="compose"
          />
          <span>Compose</span>
        </div>
        <div className="d-flex align-items-center">
          <p className="mb-0">Current username: {currentUser.username}</p>
          <Logout />
        </div>
      </Header>
      <Container>
        <div className="d-flex flex-column-reverse">
          {messages.map((message) => {
            return (
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="title-box">
                      <p className="created d-flex w-50 mb-0">{message.created}</p>
                      <p className="fw-bold mb-0">{message.fromUser}</p>
                    </div>
                    <div className="mail-text">
                      <span className="mail-text-title">{message.title}</span>
                      <span className="mail-text-dummy">{message.message}</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="mail-text">
                      <p className="company mb-2 fw-bold fs-5">
                        <span className="fw-bold fs-6">От кого:</span> {message.fromUser}{' '}
                        <span className="fw-normal fs-6">{message.created}</span>
                      </p>
                      <p className="mail-text-title mb-2 fs-6">Тема: {message.title}</p>
                      <p className="mail-text-dummy">{message.message}</p>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </div>
      </Container>
      <ChatInput
        active={modalActive}
        setActive={setModalActive}
        handleSendMsg={handleSendMsg}
        users={users}
      />
    </div>
  );
}

const Container = styled.div`
.created{
  font-size: 0.8vw;
  padding-right: 10px;
}
  .accordion-body {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 110px;

    .mail-text {
      display: flex;
      flex-direction: column;
      margin-left: 0;
    }

    .mail-text-dummy {
      padding-left: 0;
    }
  }
  .accordion-button {
    display: grid;
    grid-template-columns: 3fr 7fr;
    align-items: center;
    font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
    font-size: 1rem;
    letter-spacing: 0.2px;
    height: 45px;
    border-bottom: 1px solid skyblue;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.7s;

    &::after {
      display: none;
    }

    &:focus {
      display: none;
    }

    &:hover {
      box-shadow: 1px 1px 2px grey;
    }
  }

  .title-box {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 20px;
  }

  .mail-text {
    margin-left: 10px;
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mail-text-title {
    font-weight: bold;
    margin-right: 5px;
  }

  .mail-text-dummy {
    padding-left: 20px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid skyblue;
  p {
    margin-right: 20px;
  }

  .compose-btn {
    margin-top: 10px;
    height: 50px;
    width: 150px;

    display: flex;
    align-items: center;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
    border-radius: 25px;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: #f2f1f1;
    }

    span {
      margin-left: 10px;
      font-weight: 500;
    }
  }
`;
