import { world, system } from '@minecraft/server';
export function guardar(_0x32dbb1, _0x15d2c2) {
   
        const _0x195df2 = JSON.stringify(_0x15d2c2);
        world.setDynamicProperty(_0x32dbb1, _0x195df2);
 
}
export function cargar(_0x5c9578) {
        const _0x1e0835 = world.getDynamicProperty(_0x5c9578);
        if (_0x1e0835) {
          return JSON.parse(_0x1e0835);
        }
        return null;
 
}
export function del(_0x2794f8) {

     world.setDynamicProperty(_0x2794f8, null);
}