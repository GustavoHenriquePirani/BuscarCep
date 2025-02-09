import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";

const FormPage = () => {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [regiao, setRegiao] = useState("");
  const [ibge, setIbge] = useState("");
  const [valido, setValido] = useState(false);
  const [encontrado, setEncontrado] = useState("");

  const handleCep = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value);
  };

  const clear = (limparCep = true) => {
    if (limparCep) {
      setCep("");
    }
    setEndereco("");
    setBairro("");
    setCidade("");
    setUf("");
    setRegiao("");
    setIbge("");
    setValido(false);
    setEncontrado(false);
  };

  const fetchCep = async () => {
    clear(false);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setValido(true);
        setEncontrado(false);
        return;
      }

      setEndereco(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setUf(data.estado || "");
      setRegiao(data.regiao || "");
      setIbge(data.ibge || "");

      const camposEssenciais = [
        data.endereco,
        data.bairro,
        data.cidade,
        data.uf,
        data.regiao,
        data.ibge,
      ];
      const todosVazios = camposEssenciais.every((campo) => {
        return !campo || campo.toString().trim() === "";
      });

      if (todosVazios) {
        setEncontrado(false);
      } else {
        setEncontrado(true);
      }

      setValido(true);
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <Form className="col-10 col-md-6 col-lg-4 m-auto mt-sm-5 mt-4">
      <div className="d-flex flex-column align-items-center text-center">
        <h1>BUSCAR CEP</h1>
        <p>Aqui você consegue encontrar um endereço fornecendo o CEP.</p>
      </div>

      <Row className="pt-sm-4 pt-3 d-flex g-2 align-items-end">
        <Col xs={8} md={9} lg={10} className="d-flex">
          <div className="w-100">
            <label>CEP:</label>
            <input
              type="text"
              value={cep}
              onChange={handleCep}
              maxLength={8}
              className="form-control"
            />
          </div>
        </Col>

        <Col xs={4} md={3} lg={2} className="justify-content-center">
          <Button
            className="bg-success ms-3 ps-lg-4 pe-lg-4"
            disabled={cep.length < 8}
            onClick={fetchCep}
          >
            Buscar
          </Button>
        </Col>
      </Row>

      <Col className="pt-4">
        {valido && encontrado && (
          <p className="mt-4 texto encontrado">
            *Aqui estão os valores encontrados com base no CEP informado*
          </p>
        )}
        {valido && !encontrado && (
          <p className="mt-4 texto invalido">
            *O CEP informado não é válido ou não foi encontrado, verifique se o
            CEP está correto ou digite outro*
          </p>
        )}
        {!valido && (
          <p className="mt-4 texto padrao">
            *Esses campos serão preenchidos automaticamente quando um CEP válido
            for informado*
          </p>
        )}
        <label>Endereço:</label>
        <input
          className="form-control bg-white"
          type="text"
          disabled={true}
          value={endereco}
        />
      </Col>

      <Col className="pt-3">
        <label>Bairro:</label>
        <input
          className="form-control bg-white"
          type="text"
          disabled={true}
          value={bairro}
        />
      </Col>

      <Row className="g-2">
        <Col xs={12} md={6} className=" pt-3 ">
          <label>Cidade:</label>
          <input
            type="text"
            className="form-control bg-white"
            disabled={true}
            value={cidade}
          />
        </Col>

        <Col xs={12} md={6} className=" pt-3 ">
          <label>UF:</label>
          <input
            type="text"
            className="form-control bg-white"
            disabled={true}
            value={uf}
          />
        </Col>
      </Row>

      <Row className="g-2">
        <Col xs={12} md={6} className=" pt-3 ">
          <label>Região:</label>
          <input
            type="text"
            className="form-control bg-white"
            disabled={true}
            value={regiao}
          />
        </Col>

        <Col xs={12} md={6} className=" pt-3 ">
          <label>IBGE:</label>
          <input
            type="text"
            className="form-control bg-white"
            disabled={true}
            value={ibge}
          />
        </Col>
      </Row>

      <Button className="mt-4 mt-sm-5" onClick={() => clear(true)}>
        Limpar Tudo
      </Button>
    </Form>
  );
};

export default FormPage;
