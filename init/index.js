const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then((res)=>{
  console.log("db connected");
})
.catch((err) => console.log(err));

const initdb= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner: '671895fcf5a9081feb502a3e'}));
    await Listing.insertMany(initData.data);

    console.log("data is initialized");
}

initdb();