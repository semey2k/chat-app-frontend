import React, { useState } from 'react';
import styles from './ChatInput.module.scss';
import Button from 'react-bootstrap/Button';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function ChatInput({ handleSendMsg, active, setActive, users }) {
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [recipient, setRecipient] = useState([]);

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg, title, recipient);
      setMsg('');
      setRecipient([]);
      setTitle('');
    }
  };


  return (
    <div className={active ? styles.modal__active : styles.modal} onClick={() => setActive(true)}>
      <div className={styles.popup__header}>
        <span className={styles.span}>New message</span>
      </div>
      <form className={styles.input__container} onSubmit={(event) => sendChat(event)}>
        <Typeahead
          type="text"
          placeholder="Recepient"
          id="basic-typeahead-single"
          options={users.map((el) => el.username)}
          selected={recipient}
          onChange={setRecipient}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          className={styles.input__title}
          onChange={(e) => setTitle(e.target.value)}></input>
        <textarea
          type="text"
          placeholder="type your message here"
          contentEditable="true"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <Button type="submit" className="m-2" variant="primary">
          Send
        </Button>
      </form>
    </div>
  );
}
