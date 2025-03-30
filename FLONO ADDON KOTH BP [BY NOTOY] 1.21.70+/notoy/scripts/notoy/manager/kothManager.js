import { system, world, BlockVolume } from '@minecraft/server';
import { cargar } from '../db';
let activeKOTHs = {};
let scheduledIntervals = {};
let lastNoPlayersMessage = {};
let lastPlayerEnterMessage = {};
export function KothInciadoAuto(_0x2bbf58, _0xc11df8) {
  if (scheduledIntervals[_0x2bbf58]) {
    system.clearRun(scheduledIntervals[_0x2bbf58]);
  }
  const _0xaf873 = _0xc11df8 * 0x4b0;
  scheduledIntervals[_0x2bbf58] = system.runInterval(() => {
    const _0x4e1794 = cargar("koths")[_0x2bbf58];
    if (!_0x4e1794) {
      system.clearRun(scheduledIntervals[_0x2bbf58]);
      return;
    }
    iniciarKothMO(_0x4e1794.pos1, _0x4e1794.pos2, _0x2bbf58, _0x4e1794.puntosMaximos, _0x4e1794.puntosPorSegundo);
    world.sendMessage("§aLa KOTH \"" + _0x2bbf58 + "\" ha iniciado automáticamente.");
  }, _0xaf873);
}
export function iniciarKothMO(_0x122a28, _0x374b0f, _0xd162bf, _0x1ec38a, _0x1e56fa = 0x1) {
  const _0x2f73fa = new BlockVolume({
    'x': _0x122a28[0x0],
    'y': _0x122a28[0x1],
    'z': _0x122a28[0x2]
  }, {
    'x': _0x374b0f[0x0],
    'y': _0x374b0f[0x1],
    'z': _0x374b0f[0x2]
  });
  const _0x2926bb = "koth_" + _0xd162bf.replace(/\s+/g, '_');
  if (world.scoreboard.getObjective(_0x2926bb)) {
    world.scoreboard.removeObjective(_0x2926bb);
  }
  world.scoreboard.addObjective(_0x2926bb, "§6[§fKOTH§6] " + _0xd162bf);
  // world.getAllPlayers().forEach(pl => {
  //   pl.runCommandAsync("scoreboard players reset @a " + _0x2926bb);
  // });
  activeKOTHs[_0xd162bf] = {
    'name': _0xd162bf,
    'volume': _0x2f73fa,
    'playersInside': new Set(),
    'maxPoints': _0x1ec38a,
    'puntosPorSegundo': _0x1e56fa,
    'objectiveName': _0x2926bb
  };
  system.runInterval(() => {
    const _0x2118d8 = activeKOTHs[_0xd162bf];
    if (!_0x2118d8) {
      return;
    }
    const _0xbb1bcb = world.getAllPlayers();
    const _0x3a3a2a = new Set();
    _0xbb1bcb.forEach(_0x107cc5 => {
      if (_0x2118d8.volume.isInside(_0x107cc5.location)) {
        _0x3a3a2a.add(_0x107cc5.nameTag);
        if (!lastPlayerEnterMessage[_0x107cc5.nameTag] || system.currentTick - lastPlayerEnterMessage[_0x107cc5.nameTag] >= 0x258) {
          world.sendMessage("§6[" + _0xd162bf + "] §f" + _0x107cc5.nameTag + " §eha ingresado a la §6KOTH.");
          lastPlayerEnterMessage[_0x107cc5.nameTag] = system.currentTick;
        }
        const _0x517cd6 = world.scoreboard.getObjective(_0x2118d8.objectiveName);
        if (_0x517cd6) {
          _0x517cd6.addScore(_0x107cc5, _0x2118d8.puntosPorSegundo);
          const _0x38219d = _0x517cd6.getScore(_0x107cc5);
          if (_0x38219d >= _0x2118d8.maxPoints) {
            KothFinal(_0xd162bf);
          }
        }
      }
    });
    if (_0x3a3a2a.size === 0x0) {
      if (!lastNoPlayersMessage[_0xd162bf] || system.currentTick - lastNoPlayersMessage[_0xd162bf] >= 0x4b0) {
        world.sendMessage("§e[" + _0xd162bf + "] §cNadie está en la KOTH.");
        lastNoPlayersMessage[_0xd162bf] = system.currentTick;
      }
    }
    _0x2118d8.playersInside = _0x3a3a2a;
    actualizarKoth(_0xd162bf, _0x2118d8.objectiveName);
  }, 0x14);
}
function actualizarKoth(_0x839480, _0x20bf6a) {
  const _0x593304 = Array.from(activeKOTHs[_0x839480]?.["playersInside"] || []);
  if (_0x593304.length === 0x0) {
    return;
  }
  const _0x51c24f = world.scoreboard.getObjective(_0x20bf6a);
  if (!_0x51c24f) {
    return;
  }
  _0x593304.forEach(_0x458860 => {
    const _0x3bb02b = world.getPlayers().find(_0x10508b => _0x10508b.nameTag === _0x458860);
    if (_0x3bb02b) {
      system.run(() => {
        _0x3bb02b.runCommand("scoreboard objectives setdisplay sidebar " + _0x20bf6a);
      })
    }
  });
};
function KothFinal(_0x591bc4) {
  const _0x5915e6 = activeKOTHs[_0x591bc4];
  if (!_0x5915e6) {
    return;
  }
  const _0x495ed4 = world.scoreboard.getObjective(_0x5915e6.objectiveName);
  if (!_0x495ed4) {
    delete activeKOTHs[_0x591bc4];
    return;
  }
  const _0x4f200c = [];
  world.getAllPlayers().forEach(_0x448bd2 => {
    const _0x51f656 = _0x495ed4.getScore(_0x448bd2);
    if (_0x51f656 > 0x0) {
      _0x4f200c.push({
        'player': _0x448bd2,
        'name': _0x448bd2.nameTag,
        'score': _0x51f656
      });
    }
  });
  _0x4f200c.sort((_0x2439fb, _0x54e3af) => _0x54e3af.score - _0x2439fb.score);
  world.sendMessage("\n\n§3§lKOTH §6[§f" + _0x5915e6.name + "§6] §3finalizada.\n\n");
  world.sendMessage("§f[KOTH] §aTABLA DE §bRESULTADOS:");
  _0x4f200c.slice(0x0, 0x5).forEach((_0x3fb9ba, _0x2a74e9) => {
    world.sendMessage("\n§e" + (_0x2a74e9 + 0x1) + ". §l§a[§6" + _0x3fb9ba.name + "§6] §f| Puntos: §b" + _0x3fb9ba.score + "\n");
    Recomepensas(_0x591bc4, _0x2a74e9 + 0x1, _0x3fb9ba.player, _0x5915e6.name);
  });
  world.scoreboard.removeObjective(_0x5915e6.objectiveName);
  delete activeKOTHs[_0x591bc4];
  system.run(()=> {
    const _0x5b34c4 = cargar('koths') || {};
    const _0xed54c = _0x5b34c4[_0x591bc4];
    if (_0xed54c && _0xed54c.intervalo > 0x0) {
      KothInciadoAuto(_0x591bc4, _0xed54c.intervalo);
      world.sendMessage("\n§f[KOTH]§6[§f" + _0x5915e6.name + "§6] reprogramada para inicio automático en " + _0xed54c.intervalo + " minutos.");
    }
  });
}
;
function Recomepensas(_0x59ec40, _0x59b0da, _0x12fe16, _0x4daba0) {
  system.run(() => {
    const _0x5de34a = cargar("koths") || {};
    const _0x16fa89 = _0x5de34a[_0x59ec40];
    const _0x2a3d78 = _0x16fa89.recompensas?.[_0x59b0da] || [];
    _0x2a3d78.forEach(_0x564d31 => {
      _0x12fe16.runCommand("give @s " + _0x564d31.item + " " + _0x564d31.cantidad);
    });
    const _0x41b323 = _0x16fa89.comandos?.[_0x59b0da] || [];
    _0x41b323.forEach(_0x3d8cfe => {
      _0x12fe16.runCommand(_0x3d8cfe);
    });
    _0x12fe16.sendMessage("\n§f[KOTH]§6[§f" + _0x4daba0 + "§6] §a¡Recompensas y comandos ejecutados para el puesto " + _0x59b0da + "!§a");
  });
}
export function inicializarKothAuto() {
  system.run(() => {
    const _0x23fd16 = cargar("koths") || {};
    Object.keys(_0x23fd16).forEach(_0x17dfd7 => {
      const _0xbbca26 = _0x23fd16[_0x17dfd7];
      if (_0xbbca26.intervalo > 0x0) {
        KothInciadoAuto(_0x17dfd7, _0xbbca26.intervalo);
      }
    });
  });
}