const { Telegraf } = require('telegraf')

const bot = new Telegraf('2026730005:AAH7FEMPq8POyRVa7iDWqe04XHnKKUPUYvo')
const date_ob = new Date();

const mysql = require('mysql');

var dataSts = {}
var dateCek = {}
  
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'test'
// }) 

const conn = mysql.createConnection({
    host: '10.97.3.212',
    user: 'user_ync',
    password: 'yncpamasuka2019#',
    database: 'digipos_revamp_v2'
})
 
conn.connect(function(err){
    if(err){
        throw err;
    } 
    console.log('connected'); 
})
 

bot.start(async (ctx) => { ctx.reply('Selamat Datang '+ctx.from.first_name); })
 
// sub function 
    function sqlCek(sql,dt){
        return new Promise(function (resolve, reject){
            conn.query(sql, function (err, result){
                if(err){
                    let year = date_ob.getFullYear(); // current year 
                    let month = ("0" + (date_ob.getMonth() )).slice(-2);  // current month 
                    let date = year+month;
                    resolve(date)
                } else{
                    resolve(dt)
                }
            })
        })
    } 

    function getDate5(date){   

        date = date+'01'

        sql = "select " +
            "DATE_FORMAT('"+date+"', '%Y%m') date1, " +
            "DATE_FORMAT((DATE_SUB("+date+", INTERVAL 1 MONTH)), '%Y%m') date2, " +
            "DATE_FORMAT((DATE_SUB("+date+", INTERVAL 2 MONTH)), '%Y%m') date3, " +
            "DATE_FORMAT((DATE_SUB("+date+", INTERVAL 3 MONTH)), '%Y%m') date4, " +
            "DATE_FORMAT((DATE_SUB("+date+", INTERVAL 4 MONTH)), '%Y%m') date5 ";
            
        return new Promise(function (resolve, reject){
            conn.query(sql, function (err, result){  
                if(err){
                    resolve(null);  
                } else{  
                    Object.keys(result).forEach(function(key) { 
                        var row = result[key];
                        var xyz = row  
                        resolve(xyz) 
                    });   
                } 
            })
        })   
    } 

    function sqlCek1(sql){  
        return new Promise(function (resolve, reject){
            conn.query(sql, function (err, result){  
                console.log(result)
                if(err){
                    resolve(null);  
                } else if(result==''){ 
                     // masalah tidak null tapi kosong 
                    resolve(null);  
                } else{   
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        var xyz = row  
                        resolve(xyz.serial_number) ;
                    });   
                } 
            })
        })   
    }  

    function sqlCek2(sql,tbl){   
        console.log("query")  
        return new Promise(function (resolve, reject){
            conn.query(sql, function (err, result){  
                console.log("hasil query")  
                if(err){
                    resolve(null);  
                } else if(result==''){ 
                     // masalah tidak null tapi kosong 
                    resolve(null);   
                } else{ 
                    console.log('2')
                    Object.keys(result).forEach(function(key) {
                        var row = result[key];
                        var xyz = row  
                        var tbl1 = 'xyz.'+tbl 
                        // console.log(arr);
                        resolve(tbl1) ;
                    });   
                } 
            })
        })   
    } 
// end

// data2_1    
    bot.command('DOVF', ctx=>{ 
    
        let input = ctx.message.text.split(" ");
        if(input.length != 2){
            ctx.reply("anda harus menulis MSISDN Code pada argumen ke 2"); 
        } else{
            let dataInput = input[1]; 
            ctx.reply("🕙 Please wait ...");   
            getData2(dataInput,ctx); 
        } 
    }) 
 
    async function getData2(dataInput, ctx) { 
 
        let year = date_ob.getFullYear(); // current year 
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);  // current month 
        let date = year+month;
        
        var sql1 = "select * from data_do.DO_AREA4_"+date+" limit 1" ;
        // var sql2 = "select * from digipos_revamp_v2.report_sellthru_"+date+" limit 1" ;
        var sql3 = "select * from digipos_revamp_v2.report_outlet_reference_"+date+" limit 1" ;
        
        dataSts['data1']  = await sqlCek(sql1,date);
        // dataSts['data2']  = await sqlCek(sql2,date);
        dataSts['data3']  = await sqlCek(sql3,date);
        
        dateCek['date1']  = await getDate5(dataSts['data1']);
        // dateCek['date2']  = await getDate5(dataSts['data2']);

        var dateCek1 = new Array(
            dateCek['date1'].date1,
            dateCek['date1'].date2,
            dateCek['date1'].date3,
            dateCek['date1'].date4,
            dateCek['date1'].date5
        )
        
        // var dateCek2 = new Array(
        //     dateCek['date2'].date1,
        //     dateCek['date2'].date2,
        //     dateCek['date2'].date3,
        //     dateCek['date2'].date4,
        //     dateCek['date2'].date5
        // )
  
        console.log("start setion 1")

        //cek tbl 1
        for (let i = 0; i < 5; i++) {   
            console.log("cek")  
            console.log(dateCek1[i]) 
            var dtFix1 = dateCek1[i] 
 
            var sql_cek = "select MSISDN_CODE from data_do.DO_AREA4_"+dateCek1[i]+" where MSISDN_CODE="+dataInput+" limit 1  " ;
            dataSts['data5']  = await sqlCek2(sql_cek,"MSISDN_CODE"); 

            if(dataSts['data5'] !== null){  
                break;   
            } 
        } 

        console.log(dataSts['data5']);
        console.log(dtFix1)

        if(dataSts['data5'] !== null){  
            console.log("data ditemukan");

             //cek tbl 2  
            // for (let i = 0; i < 5; i++) {    

            //     console.log(dateCek2[i])  
            //     var dtFix2 = dateCek2[i] 
            //     var sql_cek = "select serial_number from (select * from data_do.DO_AREA4_"+dtFix1+" where MSISDN_CODE="+dataInput+" limit 1)a LEFT JOIN (  select serial_number from digipos_revamp_v2.report_sellthru_"+dateCek2[i]+"  ) b ON  serial_number=MSISDN_CODE  " ;
            //     dataSts['data4']  = await sqlCek1(sql_cek); 

            //     if(dataSts['data4'] !== null){  
            //         break;   
            //     } 
            // }  
    
            console.log(dtFix2)  
        
            var sql = "SELECT " + 
                "msisdn_code as No_seri_vf,PRODUCT_CODE as kode_produk, DIST_DATE as tgl_distribusi, " +

                "Nama_SBP, Cluster,c.Branch, Regional "+
                
                // ", tgl_sellthru, sf_sellthru, id_outlet_st, " +

                // "no_rs,nama_outlet,kelurahan,kecamatan, kota "+

                "from (select * from data_do.DO_AREA4_"+dtFix1+" where MSISDN_CODE="+dataInput+" limit 1)a " +

                // "LEFT JOIN (select serial_number,created_date as tgl_sellthru, outlet_id as id_outlet_st,sf_code as sf_sellthru  from digipos_revamp_v2.report_sellthru_"+dtFix2+" ) b ON serial_number=MSISDN_CODE " +
                
                "LEFT JOIN (select `AD Code` as AD_Code1,`Nama AD` as Nama_SBP,Cluster,Branch, Regional from test.refference_code_AD_nasional) c ON AD_Code=AD_Code1 "; 
                
                // "LEFT JOIN (select no_rs,outlet_id as otl_id, nama_outlet, kelurahan,kecamatan, kota from digipos_revamp_v2.report_outlet_reference_"+dataSts['data3']+")d ON otl_id=id_outlet_st  limit 1 ";

            conn.query(sql, function (err, result, fields){

                console.log(sql);

                if(err){  
                    throw err;
                } 
                console.log(result.length);

                if(result.length>0){ 
                    let dataResult = 'Hasil Pencarian DO Voucher Fisik : \n\n';

                    result.forEach(item =>{ 
                        dataResult += 'No_seri_vf : '+item.No_seri_vf+'\n',
                        dataResult += 'kode_produk : '+item.kode_produk+'\n',
                        dataResult += 'tgl_distribusi : '+item.tgl_distribusi+'\n',
                        dataResult += 'Nama_SBP : '+item.Nama_SBP+'\n',
                        dataResult += 'Cluster : '+item.Cluster+'\n',
                        dataResult += 'Branch : '+item.Branch+'\n',
                        dataResult += 'Regional : '+item.Regional+'\n'
                        // dataResult += 'tgl_sellthru : '+item.tgl_sellthru+'\n',
                        // dataResult += 'sf_sellthru : '+item.sf_sellthru+'\n',
                        // dataResult += 'id_outlet_st : '+item.id_outlet_st+'\n',
                        // dataResult += 'no_rs : '+item.no_rs+'\n',
                        // dataResult += 'nama_outlet : '+item.nama_outlet+'\n',
                        // dataResult += 'kelurahan : '+item.kelurahan+'\n',
                        // dataResult += 'kecamatan : '+item.kecamatan+'\n',
                        // dataResult += 'kota : '+item.kota+'\n' 
                    })  
     
                    result = dataResult 
                    ctx.reply(result)
                } else { 
                    result = "gagal"
                    ctx.reply(result)
                } 
                
            })  
        } else { 
            result = "Data tidak ditemukan"
            ctx.reply(result)
        } 
    }   
// end 

// data2_2
    bot.command('DOSP', ctx=>{ 
        
        let input = ctx.message.text.split(" ");
        if(input.length != 2){
            ctx.reply("anda harus menulis MSISDN pada argumen ke 2");
            return
        }
        let dataInput = input[1];

        ctx.reply("🕙 Please wait ...");

        getData2_2(dataInput,ctx); 

    })   

    async function getData2_2(dataInput,ctx){ 
        let year = date_ob.getFullYear(); // current year 
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);  // current month 
        let date = year+month;

        var sql1 = "select * from data_do.DO_AREA4_"+date+" limit 1" ;
        // var sql2 = "select * from digipos_revamp_v2.report_sellthru_"+date+" limit 1" ;
        var sql3 = "select * from digipos_revamp_v2.report_outlet_reference_"+date+" limit 1" ;

        dataSts['data1']  = await sqlCek(sql1,date);
        // dataSts['data2']  = await sqlCek(sql2,date);
        // dataSts['data3']  = await sqlCek(sql3,date);

        dateCek['date1']  = await getDate5(dataSts['data1']);
        // dateCek['date2']  = await getDate5(dataSts['data2']);

        var dateCek1 = new Array(
            dateCek['date1'].date1,
            dateCek['date1'].date2,
            dateCek['date1'].date3,
            dateCek['date1'].date4,
            dateCek['date1'].date5
        )
        
        // var dateCek2 = new Array(
        //     dateCek['date2'].date1,
        //     dateCek['date2'].date2,
        //     dateCek['date2'].date3,
        //     dateCek['date2'].date4,
        //     dateCek['date2'].date5
        // )
    
        console.log("start setion 1")

        //cek tbl 1 

        for (let i = 0; i < 5; i++) {    
            console.log("cek")  
            console.log(dateCek1[i]) 
            var dtFix1 = dateCek1[i] 

            var sql_cek = "select MSISDN_CODE from data_do.DO_AREA4_"+dateCek1[i]+" where MSISDN="+dataInput+" limit 1  " ;
            dataSts['data5']  = await sqlCek2(sql_cek,"MSISDN_CODE"); 

            if(dataSts['data5'] !== null){  
                break;   
            } 
        } 

        console.log(dataSts['data5']);
        console.log(dtFix1)

        if(dataSts['data5'] !== null){  
            console.log("data ditemukan");
              // cek tbl 2
            //   for (let i = 0; i < 5; i++) {    

            //     console.log(dateCek2[i])  
            //     var dtFix2 = dateCek2[i] 
    
            //     var sql_cek = "select serial_number from (select * from data_do.DO_AREA4_"+dtFix1+" where MSISDN="+dataInput+" limit 1)a LEFT JOIN (  select serial_number,msisdn as msisdn1 from digipos_revamp_v2.report_sellthru_"+dateCek2[i]+"  ) b ON msisdn1=msisdn " ;
            //     dataSts['data4']  = await sqlCek1(sql_cek); 
    
            //     if(dataSts['data4'] !== null){  
            //         break;   
            //     } 
            // }  

            // console.log(dtFix2)  

            var sql = "SELECT " + 
            "msisdn_code as No_seri_vf,PRODUCT_CODE as kode_produk, DIST_DATE as tgl_distribusi, " +

            "Nama_SBP, Cluster,c.Branch, Regional " +
            
            // ", tgl_sellthru, sf_sellthru, id_outlet_st, " +

            // "no_rs,nama_outlet,kelurahan,kecamatan, kota "+

            "from (select * from data_do.DO_AREA4_"+dtFix1+" where MSISDN="+dataInput+" limit 1)a " +

            // "LEFT JOIN (select msisdn as msisdn1,created_date as tgl_sellthru, outlet_id as id_outlet_st,sf_code as sf_sellthru  from digipos_revamp_v2.report_sellthru_"+dtFix2+" ) b ON msisdn1=msisdn " +
            
            "LEFT JOIN (select `AD Code` as AD_Code1,`Nama AD` as Nama_SBP,Cluster,Branch, Regional from test.refference_code_AD_nasional) c ON AD_Code=AD_Code1 ";
            
            // "LEFT JOIN (select no_rs,outlet_id as otl_id, nama_outlet, kelurahan,kecamatan, kota from digipos_revamp_v2.report_outlet_reference_"+dataSts['data3']+")d ON otl_id=id_outlet_st limit 1 ";

            conn.query(sql, function (err, result, fields){

                console.log(sql);

                if(err){
                    throw err;
                } 
                console.log(result.length);

                if(result.length>0){
                    let dataResult = 'Hasil Pencarian DO Kartu Perdana : \n\n';

                    result.forEach(item =>{ 
                        dataResult += 'No_seri_vf : '+item.No_seri_vf+'\n',
                        dataResult += 'kode_produk : '+item.kode_produk+'\n',
                        dataResult += 'tgl_distribusi : '+item.tgl_distribusi+'\n',
                        dataResult += 'Nama_SBP : '+item.Nama_SBP+'\n',
                        dataResult += 'Cluster : '+item.Cluster+'\n',
                        dataResult += 'Branch : '+item.Branch+'\n',
                        dataResult += 'Regional : '+item.Regional+'\n'
                        // dataResult += 'tgl_sellthru : '+item.tgl_sellthru+'\n',
                        // dataResult += 'sf_sellthru : '+item.sf_sellthru+'\n',
                        // dataResult += 'id_outlet_st : '+item.id_outlet_st+'\n',
                        // dataResult += 'no_rs : '+item.no_rs+'\n',
                        // dataResult += 'nama_outlet : '+item.nama_outlet+'\n',
                        // dataResult += 'kelurahan : '+item.kelurahan+'\n',
                        // dataResult += 'kecamatan : '+item.kecamatan+'\n',
                        // dataResult += 'kota : '+item.kota+'\n' 
                    })  

                    ctx.reply(dataResult);
                } else {
                    ctx.reply("gagal");
                }   
            })  
        }else{
            ctx.reply("Data tidak ditemukan");
        } 
    } 
// end 

// data1
    bot.command('RS', ctx=>{ 
        
        let input = ctx.message.text.split(" ");
        if(input.length != 2){
            ctx.reply("anda harus menulis Nomor RS pada argumen ke 2");
            return
        }
        let dataInput = input[1];

        ctx.reply("🕙 Please wait ...");

        getData1(dataInput,ctx); 

    }) 

    async function getData1(dataInput,ctx){ 
        let year = date_ob.getFullYear(); // current year 
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);  // current month 
        let date = year+month;

        var sql1 = "select nama_outlet from digipos_revamp_v2.report_outlet_reference_"+date+" limit 1" ;  
        dataSts['data1']  = await sqlCek(sql1,date); 

        var sql = "select no_rs,no_konfirmasi,outlet_id,nama_outlet,klasifikasi,created_date as tgl_jadi_rs, kategori, "+
                "tipe_outlet, fisik, sf_code as nama_sf, jadwal_kunjungan as frekuensi_visit, terakhir_dikunjungi as terakhir_visit, kelurahan,kecamatan, kota as kota_kab, cluster, branch, regional, area, longitude, latitude, filedate as data_update "+ 
                
                "from (select * from report_outlet_reference_"+dataSts['data1'] +" where no_rs="+dataInput+" ORDER BY tgl_loading DESC limit 1) a ";

        conn.query(sql, function (err, result, fields){

            if(err){
                throw err;
            }
            // console.log(result);

            if(result.length>0){
                let dataResult = 'Hasil Pencarian RS : \n\n';

                result.forEach(item =>{ 
                    dataResult += 'no_rs: '+item.no_rs+'\n',
                    dataResult += 'no_konfirmasi: '+item.no_konfirmasi+'\n',
                    dataResult += 'outlet_id: '+item.outlet_id+'\n',
                    dataResult += 'nama_outlet: '+item.nama_outlet+'\n',
                    dataResult += 'klasifikasi: '+item.klasifikasi+'\n',
                    dataResult += 'tgl_jadi_rs: '+item.tgl_jadi_rs+'\n',
                    dataResult += 'kategori: '+item.kategori+'\n',
                    dataResult += 'tipe_outlet: '+item.tipe_outlet+'\n',
                    dataResult += 'fisik: '+item.fisik+'\n',
                    dataResult += 'nama_sf: '+item.nama_sf+'\n',
                    dataResult += 'frekuensi_visit: '+item.frekuensi_visit+'\n',
                    dataResult += 'terakhir_visit: '+item.terakhir_visit+'\n',
                    dataResult += 'kelurahan: '+item.kelurahan+'\n',
                    dataResult += 'kecamatan: '+item.kecamatan+'\n',
                    dataResult += 'kota_kab: '+item.kota_kab+'\n',
                    dataResult += 'cluster: '+item.cluster+'\n',
                    dataResult += 'branch: '+item.branch+'\n',
                    dataResult += 'regional: '+item.regional+'\n',
                    dataResult += 'area: '+item.area+'\n',
                    dataResult += 'longitude: '+item.longitude+'\n',
                    dataResult += 'latitude: '+item.latitude+'\n',
                    dataResult += 'data_update: '+item.data_update+'\n'
                })  

                ctx.reply(dataResult);
            } else {
                ctx.reply("Data tidak ditemukan");
            } 
            
        })  
    } 
// end 

// data3
    bot.command('NSB', ctx=>{ 
            
        let input = ctx.message.text.split(" ");
        if(input.length != 2){
            ctx.reply("anda harus menulis B_Number pada argumen ke 2");
            return
        }
        let dataInput = input[1]; 

        if(dataInput.substring(0,1) !== '0'){
            console.log(dataInput.substring(0,1))
            ctx.reply("angka harus diawali 08xxx");

        } else { 
            var Text = dataInput.indexOf('0') == 0 ? dataInput.substring('1') : dataInput;
            var NewString = '62'+Text 
    
            ctx.reply("🕙 Please wait ..."); 
            
            getData3(NewString,ctx);  
        } 
      
    }) 

    async function getData3(dataInput, ctx) {  
        let year = date_ob.getFullYear(); // current year 
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);  // current month 
        let date = year+month;

        var sql1 = "select * from digipos_revamp_v2.report_nsb_"+date+" limit 1" ;
        // var sql2 = "select * from digipos_revamp_v2.report_sellthru_"+date+" limit 1" ;
        var sql3 = "select * from digipos_revamp_v2.report_outlet_reference_"+date+" limit 1" ;

        dataSts['data1']  = await sqlCek(sql1,date);
        // dataSts['data2']  = await sqlCek(sql2,date);
        dataSts['data3']  = await sqlCek(sql3,date);

        dateCek['date1']  = await getDate5(dataSts['data1']);
        // dateCek['date2']  = await getDate5(dataSts['data2']);

        var dateCek1 = new Array(
            dateCek['date1'].date1,
            dateCek['date1'].date2,
            dateCek['date1'].date3,
            dateCek['date1'].date4,
            dateCek['date1'].date5
        )
        
        // var dateCek2 = new Array(
        //     dateCek['date2'].date1,
        //     dateCek['date2'].date2,
        //     dateCek['date2'].date3,
        //     dateCek['date2'].date4,
        //     dateCek['date2'].date5
        // )

        console.log("start setion 1")

        //cek tbl 1 
        for (let i = 0; i < 5; i++) {     
            console.log("cek")  
            console.log(dateCek1[i]) 
            var dtFix1 = dateCek1[i] 

            var sql_cek = "select B_NUMBER from digipos_revamp_v2.report_nsb_"+dateCek1[i]+" where B_NUMBER="+dataInput+" limit 1  " ;
            dataSts['data5']  = await sqlCek2(sql_cek,"B_NUMBER"); 

            if(dataSts['data5'] !== null){  
                break;   
            } 
        } 

        console.log(dataSts['data5']);
        console.log(dtFix1)

        if(dataSts['data5'] !== null){  
            console.log("data ditemukan");

             // cek tbl 2 
            // for (let i = 0; i < 5; i++) {    

            //     console.log(dateCek2[i])  
            //     var dtFix2 = dateCek2[i] 

            //     var sql_cek = "select serial_number from (select * from digipos_revamp_v2.report_nsb_"+dtFix1+" where B_NUMBER="+dataInput+" limit 1)a LEFT JOIN (  select serial_number,CONCAT('62',(CAST(msisdn AS UNSIGNED))) msisdn1 from digipos_revamp_v2.report_sellthru_"+dateCek2[i]+"  ) b ON msisdn1=B_NUMBER " ;
            //     dataSts['data4']  = await sqlCek1(sql_cek); 

            //     if(dataSts['data4'] !== null){  
            //         break;   
            //     }  
            // }  
        
            // console.log(dtFix2)  

            var sql = "select B_NUMBER as No_MSISDN, CREATED_DATE as Tgl_trx, Price as Harga_paket, TYPE_STOCK, CHANNEL, PACKAGE_KEYWORD as Product_code, PRODUCT_L1,PRODUCT_L2,PRODUCT_L3 "+
                    // ", OUTLET_ID, nama_outlet, RS as no_rs, sf_code as nama_sf, kelurahan,kecamatan, kota,  cluster, branch, regional, "+
                    // "tgl_sellthru,sf_sellthru,id_outlet_st "+
                    
                    "from (select * from digipos_revamp_v2.report_nsb_"+dtFix1+"  where B_NUMBER="+dataInput+" limit 1 )a "+
                    
                    "left join (select `BID ID` as Product_code1, PRODUCT_L1,PRODUCT_L2,PRODUCT_L3 from test.refference_bid_product_digipos) b ON PACKAGE_KEYWORD=Product_code1 ";
                    
                    // "LEFT JOIN (select CONCAT('62',(CAST(msisdn AS UNSIGNED))) msisdn1,created_date as tgl_sellthru, outlet_id as id_outlet_st,sf_code as sf_sellthru from digipos_revamp_v2.report_sellthru_"+dtFix2+" ) c ON msisdn1=B_NUMBER "+
                    
                    // "LEFT JOIN (select no_rs, sf_code, outlet_id as otl_id, nama_outlet, kelurahan,kecamatan, kota, cluster, branch, regional, tgl_loading as tgl_otl from digipos_revamp_v2.report_outlet_reference_"+dataSts['data3']+")d ON otl_id=OUTLET_ID "+
                    
                    "ORDER BY tgl_otl desc limit 1 ";

            conn.query(sql, function (err, result, fields){

                console.log(sql);

                if(err){
                    throw err;
                }
                console.log(result.length);

                if(result.length>0){
                    let dataResult = 'Hasil Pencarian NSB : \n\n';

                    result.forEach(item =>{ 
                        dataResult += 'No_MSISDN: '+item.No_MSISDN+'\n',
                        dataResult += 'Tgl_trx: '+item.Tgl_trx+'\n',
                        dataResult += 'Harga_paket: '+item.Harga_paket+'\n',
                        dataResult += 'TYPE_STOCK: '+item.TYPE_STOCK+'\n',
                        dataResult += 'CHANNEL: '+item.CHANNEL+'\n',
                        dataResult += 'Product_code: '+item.Product_code+'\n',
                        dataResult += 'PRODUCT_L1: '+item.PRODUCT_L1+'\n',
                        dataResult += 'PRODUCT_L2: '+item.PRODUCT_L2+'\n',
                        dataResult += 'PRODUCT_L3: '+item.PRODUCT_L3+'\n'
                        // dataResult += 'OUTLET_ID: '+item.OUTLET_ID+'\n',
                        // dataResult += 'nama_outlet: '+item.nama_outlet+'\n',
                        // dataResult += 'no_rs: '+item.no_rs+'\n'
                        // dataResult += 'nama_sf: '+item.nama_sf+'\n',
                        // dataResult += 'kelurahan: '+item.kelurahan+'\n',
                        // dataResult += 'kecamatan: '+item.kecamatan+'\n',
                        // dataResult += 'kota: '+item.kota+'\n',
                        // dataResult += 'cluster: '+item.cluster+'\n',
                        // dataResult += 'branch: '+item.branch+'\n',
                        // dataResult += 'regional: '+item.regional+'\n'
                        // dataResult += 'tgl_sellthru: '+item.tgl_sellthru+'\n',
                        // dataResult += 'sf_sellthru: '+item.sf_sellthru+'\n',
                        // dataResult += 'id_outlet_st: '+item.id_outlet_st+'\n'
                    })  
 
                    result = dataResult
                    ctx.reply(result)
                } else { 
                    result = "Gagal"
                    ctx.reply(result)
                } 
                
            })  
        }else{
            result = "Data tidak ditemukan"
            ctx.reply(result)
        }  
    } 
// end 

// data4
    bot.command('INJECT', ctx=>{ 
                
        let input = ctx.message.text.split(" ");
        if(input.length != 2){
            ctx.reply("anda harus menulis serial number pada argumen ke 2");
            return
        }
        let dataInput = input[1];

        ctx.reply("🕙 Please wait ...");

        getData4(dataInput,ctx); 
    }) 

    async function getData4(dataInput,ctx){ 
        let year = date_ob.getFullYear(); // current year 
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);  // current month 
        let date = year+month;

        var sql1 = "select * from hadoop.voucher_fisik_aktivasi_nasional_"+date+" limit 1" ;
        // var sql2 = "select * from digipos_revamp_v2.report_sellthru_"+date+" limit 1" ;
        var sql3 = "select * from digipos_revamp_v2.report_outlet_reference_"+date+" limit 1" ;

        dataSts['data1']  = await sqlCek(sql1,date);
        // dataSts['data2']  = await sqlCek(sql2,date);
        dataSts['data3']  = await sqlCek(sql3,date);

        dateCek['date1']  = await getDate5(dataSts['data1']);
        // dateCek['date2']  = await getDate5(dataSts['data2']);
    
        var dateCek1 = new Array(
            dateCek['date1'].date1,
            dateCek['date1'].date2,
            dateCek['date1'].date3,
            dateCek['date1'].date4,
            dateCek['date1'].date5
        )
        
        // var dateCek2 = new Array(
        //     dateCek['date2'].date1,
        //     dateCek['date2'].date2,
        //     dateCek['date2'].date3,
        //     dateCek['date2'].date4,
        //     dateCek['date2'].date5
        // )

        console.log("start setion 1")

        //cek tbl 1
        for (let i = 0; i < 5; i++) {   
            console.log("cek")  
            console.log(dateCek1[i]) 
            var dtFix1 = dateCek1[i] 

            var sql_cek = "select serial_number from hadoop.voucher_fisik_aktivasi_nasional_"+dateCek1[i]+" where serial_number="+dataInput+" limit 1  " ;
            dataSts['data5']  = await sqlCek2(sql_cek,"serial_number"); 

            if(dataSts['data5'] !== null){  
                break;   
            } 
        } 

        console.log(dataSts['data5']);
        console.log(dtFix1)
        
        if(dataSts['data5'] !== null){  
            console.log("data ditemukan");
    
                //cek tbl 2  
            // for (let i = 0; i < 5; i++) {    

            //     console.log(dateCek2[i])  
            //     var dtFix2 = dateCek2[i] 
    
            //     var sql_cek = "select serial_number1 from (SELECT * FROM hadoop.voucher_fisik_aktivasi_nasional_"+dtFix1+" where serial_number="+dataInput+" limit 1)a LEFT JOIN (  select serial_number as serial_number1,msisdn as msisdn1 from digipos_revamp_v2.report_sellthru_"+dateCek2[i]+"  ) b ON serial_number1=serial_number where serial_number1 is not null " ;
            //     dataSts['data4']  = await sqlCek1(sql_cek); 
      
            //     if(dataSts['data4'] !== null){  
            //         console.log(dataSts['data4'])
            //        break;   
            //     } 
            // }

            // console.log(dtFix2)  
    
            var sql = "select  "+
                     "serial_number as no_seri, event_date as tgl_trx, rech as harga_paket "+
                    //  ", outlet_id as id_outlet, nama_outlet, no_rs, nama_sf, kelurahan,kecamatan, kota, cluster, branch, regional "+
                    //  ",sf_sellthru, id_outlet_st "+
                        
                     "from (SELECT * FROM hadoop.voucher_fisik_aktivasi_nasional_"+dtFix1+" where serial_number="+dataInput+" limit 1) a ";
                        
                    //  "LEFT JOIN (select CONCAT('62',(CAST(msisdn AS UNSIGNED))) msisdn1, serial_number as serial_number1,created_date as tgl_sellthru, outlet_id as id_outlet_st,sf_code as sf_sellthru from digipos_revamp_v2.report_sellthru_"+dtFix2+" ) c ON serial_number1=serial_number "+
                        
                    //  "LEFT JOIN (select no_rs, sf_code as nama_sf, outlet_id as otl_id, nama_outlet, kelurahan,kecamatan, kota, tgl_loading as tgl_otl from digipos_revamp_v2.report_outlet_reference_"+dataSts['data3']+" )d ON otl_id=OUTLET_ID "+
                        
                     "ORDER BY tgl_otl desc limit 1 "; 
    
            conn.query(sql, function (err, result, fields){
 
                console.log(sql);
                
                if(err){
                    throw err;
                }
                // console.log(result);
    
                if(result.length>0){
                    let dataResult = 'Hasil Pencarian INJECT : \n\n';
    
                    result.forEach(item =>{ 
                        dataResult += 'no_seri: '+ item.no_seri+'\n',
                        dataResult += 'tgl_trx: '+ item.tgl_trx+'\n',
                        dataResult += 'harga_paket: '+ item.harga_paket+'\n',
                        dataResult += 'id_outlet: '+ item.id_outlet+'\n'
                        // dataResult += 'nama_outlet: '+ item.nama_outlet+'\n',
                        // dataResult += 'no_rs: '+ item.no_rs+'\n',
                        // dataResult += 'nama_sf: '+ item.nama_sf+'\n',
                        // dataResult += 'kelurahan: '+ item.kelurahan+'\n',
                        // dataResult += 'kecamatan: '+ item.kecamatan+'\n',
                        // dataResult += 'kota: '+ item.kota+'\n',
                        // dataResult += 'cluster: '+ item.cluster+'\n',
                        // dataResult += 'branch: '+ item.branch+'\n',
                        // dataResult += 'regional: '+ item.regional+'\n'
                        // dataResult += 'sf_sellthru: '+ item.sf_sellthru+'\n',
                        // dataResult += 'id_outlet_st: '+ item.id_outlet_st+'\n'
                    })  
    
                    ctx.reply(dataResult);
                } else {
                    ctx.reply("gagal");
                } 
                
            })  
        }else{
            ctx.reply("Data tidak ditemukan");
        } 
    } 
// end 

bot.launch()