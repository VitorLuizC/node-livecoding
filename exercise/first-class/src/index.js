const express = require('express');
const parser = require('body-parser');
const request = require('request');
const iconv = require('iconv-lite');
const { Parser } = require('xml2js');
const mapServices = require('./services');

const app = express();

const route = express.Router();

app.post('/calc', parser.json(), (req, res) => {
  const code = req.body.code;
  const url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx';
  const options = {
    encoding: null,
    qs: {
      nCdEmpresa: '',
      sDsSenha: '',
      sCepOrigem: '70002900',
      sCepDestino: code,
      nVlPeso: 0.800,
      nCdFormato: 1,
      nVlComprimento: 18,
      nVlAltura: 9,
      nVlLargura: 13.5,
      sCdMaoPropria: 'n',
      nVlValorDeclarado: 0,
      sCdAvisoRecebimento: 's',
      nCdServico: '40010,40045,40215,40290,41106',
      nVlDiametro: 0,
      StrRetorno: 'xml',
      nIndicaCalculo: '3'
    }
  }

  request(url, options, (error, response) => {
    const parser = new Parser();

    if (error) {
      res.status(500).send(error);
      return;
    }

    const xml = iconv.decode(response.body, 'ISO-8859-1');

    parser.parseString(xml, (error, json) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

      const data = json.Servicos.cServico
        .map(mapServices)
        .filter(service => service.price > 0);

      res.status(200).json(data);
    });
  });
});

app.listen(9000, '0.0.0.0');
