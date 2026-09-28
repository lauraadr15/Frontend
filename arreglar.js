// Uso (desde C:\ridemove-mobile):  node arreglar.js 192.168.1.4
// Arregla eas.json y app.json SIN borrar lo que ya tenían (projectId, versiones, etc.)
const fs = require("fs");

const ip = process.argv[2];
if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
  console.error("Falta la IP. Ejemplo: node arreglar.js 192.168.1.4");
  process.exit(1);
}

function leer(ruta) {
  if (!fs.existsSync(ruta)) {
    console.error(`No encuentro ${ruta}. Ejecuta este comando dentro de C:\\ridemove-mobile.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(ruta, "utf8"));
}

function guardar(ruta, obj) {
  fs.writeFileSync(ruta, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

// 1) eas.json: URL del backend dentro del build + APK instalable
const eas = leer("eas.json");
eas.build = eas.build || {};
eas.build.preview = eas.build.preview || {};
eas.build.preview.distribution = "internal";
eas.build.preview.android = { ...(eas.build.preview.android || {}), buildType: "apk" };
eas.build.preview.env = {
  ...(eas.build.preview.env || {}),
  EXPO_PUBLIC_API_URL: `http://${ip}:8080`,
};
guardar("eas.json", eas);

// 2) app.json: permitir http (cleartext) en la app instalada
const app = leer("app.json");
app.expo = app.expo || {};
const plugins = app.expo.plugins || [];
const yaEsta = plugins.some((p) => (Array.isArray(p) ? p[0] : p) === "expo-build-properties");
if (!yaEsta) {
  plugins.push(["expo-build-properties", { android: { usesCleartextTraffic: true } }]);
}
app.expo.plugins = plugins;
guardar("app.json", app);

console.log(`Listo. La app quedará apuntando a http://${ip}:8080 y con http permitido.`);
