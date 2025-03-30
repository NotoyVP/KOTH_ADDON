import { system, world } from '@minecraft/server';
import { MainMenu } from './notoy/forms/formsManager';
import { inicializarKothAuto, KothInciadoAuto } from './notoy/manager/kothManager';
import { cargar } from './notoy/db';
world.beforeEvents.itemUse.subscribe(_0x4c2a53 => {
  const _0x2da4d6 = _0x4c2a53.source;
  const _0x48b712 = _0x4c2a53.itemStack;
  if (_0x48b712.typeId === "minecraft:stick" && _0x2da4d6.hasTag("FLONO")) {
    system.run(() => MainMenu(_0x2da4d6));
  }
  ;
});


inicializarKothAuto();


world.afterEvents.worldLoad.subscribe(_0x2bffbe => {
  console.warn("§f[§6FLONO ESTUDIO§f]§6[§fKOTH ADDON§6] §eEl mundo se esta iniciado");
  system.run(() => {
    const _0x40fa37 = cargar('koths') || {};
    Object.keys(_0x40fa37).forEach(_0x4f83f4 => {
      const _0x159321 = _0x40fa37[_0x4f83f4];
      if (_0x159321.intervalo > 0x0) {
        KothInciadoAuto(_0x4f83f4, _0x159321.intervalo);
      }
    });
  });
});
world.afterEvents.playerSpawn.subscribe(_0x671e77 => {
  const _0x92d413 = _0x671e77.player;
  console.warn(_0x92d413.name);
  if (_0x671e77.initialSpawn) {
    const _0x56a201 = world.scoreboard.getObjectives();
    _0x56a201.forEach(_0x42c6b6 => {
      if (_0x42c6b6.id.startsWith('koth_')) {
        system.run(() => {
          _0x92d413.runCommandAsync("scoreboard players reset @s " + _0x42c6b6.id);
          _0x92d413.runCommandAsync("scoreboard objectives setdisplay sidebar");
        });
      }
      ;
    });
  }
  ;
});
