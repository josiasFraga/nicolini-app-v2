// realmConfig.js
import {Realm, createRealmContext} from '@realm/react';

// Defina o schema para cada linha do arquivo
// (adicione ou remova propriedades conforme a sua necessidade)
class InvertLine extends Realm.Object {
  static schema = {
    name: 'InvertLine',
    primaryKey: '_id',
    properties: {
      _id: 'objectId', // Usamos ObjectId para ter um ID único
      cod_barras: 'string',
      cod_interno: 'string',
      produto: 'string',
      rest: 'string',
    },
  };
}

// Crie o contexto do Realm com o schema definido
export const realmConfig = {
  schema: [InvertLine],
};

export const RealmContext = createRealmContext(realmConfig);
