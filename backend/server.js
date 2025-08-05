const express=require('express');
const cors=require('cors');
const path=require('path');

const app=express();
const PORT=4000;

app.listen(PORT,()=>{
    console.log("listening at port 4000");
})