import herodata from './herodata';

export const getFile = async (heroName) => {
  const {
    canonicalName,
    location,
    fileName = `${canonicalName}data.xml`,
  } = herodata[heroName];
  const path = {
    'heromods': `/heroes-editor/heroesxml/mods/heromods/${canonicalName}.stormmod/base.stormdata/gamedata/${fileName}`,
    'heroesdata.stormmod': `/heroes-editor/heroesxml/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/${canonicalName}data/${fileName}`,
  }[location];
  const result = await fetch(path);
  const data = await result.text();
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

export { herodata };
