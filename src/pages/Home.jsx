import React, { useState } from 'react';
import { Modal, ModalBody } from "reactstrap"
import axios from 'axios';


export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    toggleModal();
    axios.post("http://localhost:8000/api/payment/make-payment")
      .then((res) => {
        setHtmlContent(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className="home">
      <button className="button" onClick={handlePayment}>Ödeme Yap</button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalBody>
          <iframe srcDoc={htmlContent} style={{ width: "100%", height: "60vh" }} frameBorder="0"></iframe>
        </ModalBody>
      </Modal>
    </div>
  )
};
