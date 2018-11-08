const { query } = require("./db");


module.exports = {
  createAddress: (province, district, ward, street, number) => {
    return query(`INSERT INTO "Address"("Province","District","Ward","Street","Number") values ('${province}','${district}','${ward}','${street}','${number}') RETURNING "Id"`);
  },
  updateById: (id, province, district, ward, street, number) => {
    let hasProvince = province ? true : false;
    let hasDistrict = district ? true : false;
    let hasWard = ward? true : false;
    let hasStreet = street ? true : false;
    let hasNumber = number ? true : false;

    return query(`Update "Address" Set 
      ${hasProvince ? `"Province" = '${province}'` : ''}
      ${hasProvince || hasDistrict || hasWard || hasStreet || hasNumber ? "," : ''}
      ${hasDistrict ? `"District" = '${district}'` : ''}
      ${hasDistrict || hasWard || hasStreet || hasNumber ? "," : ''}
      ${hasWard ? `"Ward" = '${ward}'` : ''}
      ${hasStreet || hasNumber ? "," : ''}
      ${hasStreet ? `"Street" = '${street}'` : ''}
      ${hasNumber ? "," : ''}
      ${hasNumber ? `"Number" = '${number}'` : ''}
      Where "Address"."Id" = ${id}
    `)
  }
}