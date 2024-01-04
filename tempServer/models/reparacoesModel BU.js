const mongoose = require('mongoose');
import { ObjectId } from 'mongodb';

const repairSchema = new mongoose.Schema({
   _id: ObjectId,
   ID: Number,
   Maquina: String,
   NumMaquina: String,
   Marca: String,
   OrdemReparacao: Number,
   Actualizada: { type: Boolean, default: null },
   Avaria1: { type: Boolean, default: null },
   Avaria2: { type: Boolean, default: null },
   Avaria3: { type: Boolean, default: null },
   Avaria4: { type: Boolean, default: null },
   Avaria5: { type: Boolean, default: null },
   Avaria6: { type: Boolean, default: null },
   Avaria7: { type: Boolean, default: null },
   Avaria8: { type: Boolean, default: null },
   Avaria9: { type: Boolean, default: null },
   Avaria10: { type: Boolean, default: null },
   Avaria11: { type: Boolean, default: null },
   Avaria12: { type: Boolean, default: null },
   Avaria13: { type: Boolean, default: null },
   Avaria14: { type: Boolean, default: null },
   Avaria15: { type: Boolean, default: null },
   Avaria16: { type: Boolean, default: null },
   Avaria17: { type: Boolean, default: null },
   Avaria18: { type: Boolean, default: null },
   Avaria19: { type: Boolean, default: null },
   Avaria20: { type: Boolean, default: null },
   Avaria21: { type: Boolean, default: null },
   Avaria22: { type: Boolean, default: null },
   Avaria23: { type: Boolean, default: null },
   Avaria24: { type: Boolean, default: null },
   Avaria25: { type: Boolean, default: null },
   Avaria26: { type: Boolean, default: null },
   Avaria27: { type: Boolean, default: null },
   Avaria28: { type: Boolean, default: null },
   Avaria29: { type: Boolean, default: null },
   Avaria30: { type: Boolean, default: null },
   Extra1: { type: Boolean, default: null },
   Extra2: { type: Boolean, default: null },
   Extra3: { type: Boolean, default: null },
   Observacoes: String,
   DataTime: Date,
   Acessorios: { type: Boolean, default: null },
   Tipo: { type: String, default: null },
   ModeloElectrex: { type: Boolean, default: null },
   IntExt: { type: String, default: null },
   Utilizador: { type: String, default: null },
   Cliente: { type: String, default: null },
   Link: { type: String, default: null },
   LinkCheck: { type: String, default: null },
   ModeloCheck: { type: String, default: null },
});

const Repair = mongoose.model('Repair', repairSchema);
module.exports = Repair;