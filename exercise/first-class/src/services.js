const names = {
  '40010': 'SEDEX',
  '40045': 'SEDEX a Cobrar',
  '40215': 'SEDEX 10',
  '40290': 'SEDEX Hoje',
  '41106': 'PAC'
}

function map(Servico) {
  return {
    code: Servico.Codigo[0],
    name: names[Servico.Codigo[0]],
    price: +Servico.Valor[0].replace(',', '.'),
    time: +Servico.PrazoEntrega[0]
  }
}

module.exports = map;
