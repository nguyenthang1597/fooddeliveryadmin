const { query } = require("./db");
const tree = require('./tree.json');
const Districts = tree['quan-huyen'];

module.exports = {
  createAddress: (district, ward, street, number) => {
    return query(`INSERT INTO "Address"("Province","District","Ward","Street","Number") values ('Tp Hồ Chí Minh','${district}','${ward}','${street}','${number}') RETURNING "Id"`);
  },
  updateById: (id, district, ward, street, number) => {
    let hasDistrict = district ? true : false;
    let hasWard = ward? true : false;
    let hasStreet = street ? true : false;
    let hasNumber = number ? true : false;
    let makeQuery = hasDistrict && hasWard && hasStreet && hasNumber;
    if(!makeQuery) return;
    return query(`Update "Address" Set 
      ${hasDistrict ? `"District" = '${district}'` : ''}
      ${hasWard || hasStreet || hasNumber ? "," : ''}
      ${hasWard ? `"Ward" = '${ward}'` : ''}
      ${hasStreet || hasNumber ? "," : ''}
      ${hasStreet ? `"Street" = '${street}'` : ''}
      ${hasNumber ? "," : ''}
      ${hasNumber ? `"Number" = '${number}'` : ''}
      Where "Address"."Id" = ${id}
    `)
  },
  getAllDistrict: () => {
    let districts = Object.keys(Districts).map(item => ({id: item, name: Districts[item].name_with_type}))
    return districts
  },
   getWard: districtId => {
    let district = Districts[districtId];
    if(!district) return [];
    let list = [];
    list = Object.keys(district['xa-phuong']).map(item => ({id: item, name: district['xa-phuong'][item].name_with_type}))
    return list;
  },
  getWardByDistrictName: name => {
    let districtID = Object.keys(Districts).find(i => Districts[i].name_with_type === name)
    let district = Districts[districtID];
    if(!district) return [];
    list = Object.keys(district['xa-phuong']).map(item => ({id: item, name: district['xa-phuong'][item].name_with_type}))
    return list;
  }
}