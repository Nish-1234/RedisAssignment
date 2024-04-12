const express = require('express');
const app = express();
const { createClient } = require('redis');
app.use(express.json());
const client = createClient({
  
});

client.connect();

app.post('/api/', async function(req, res) {
  try {
    const {MsgType} = req.body;
    if(MsgType=="1121"){
      const {OperationType,TenantId,OMSId,ClientID} = req.body;
        if(OperationType==100)
          {
            try{
                const status = await client.hGet(`${TenantId}_${OMSId}`,`${ClientID}`);
                const addData = async ()=>{
                const ClientData=JSON.stringify(req.body)
                await client.hSet(`${TenantId}_${OMSId}`,ClientID,ClientData);
                res.send("Data received and stored in Redis");
                }
                if(!status){
                    await addData();
                }
                else res.send("user exists");

            }
            catch(err){
                res.send("error")
            }
        }
        else if(OperationType==101)
          {
            try{
              const status = await client.hGet(`${TenantId}_${OMSId}`,`${ClientID}`);
              const UpdateData = async ()=>{
              const ClientData=JSON.stringify(req.body)
              await client.hSet(`${TenantId}_${OMSId}`,ClientID,ClientData);
              res.send("Data received and Updated in Redis");
            }

            
            if(status){
                await UpdateData();
            }
            else res.send("Client not exists Add the Client First!!");


            }catch(err){
              res.send("error")
            }
          }
        else if(OperationType==102){
            try{
                const status = await client.hGet(`${TenantId}_${OMSId}`,`${ClientID}`);
                const DeleteData = async ()=>{
                console.log("hello")
                await client.hDel(`${TenantId}_${OMSId}`,ClientID);
                res.send("Data deleted from Redis");
                }

                if(status){
                    await DeleteData();
                }
                else res.send("user doesnot exists");

            }
            catch(err){
                res.send("error")
            }
        }
        else if(OperationType==103){
          const status = await client.hGet(`${TenantId}_${OMSId}`,`${ClientID}`);
          console.log(status);
          if(status){
              res.send(JSON.parse(status));
          }
          else res.send("Client not exists Add the Client First!!");
        }
        else if(OperationType==104){
          const status = await client.hGetAll(`${TenantId}_${OMSId}`);
          console.log(status);
          if(status){
            res.send(status);
          }
          else res.send("Data doesnot Exist!!");
        }  
        else{
            res.send("Wrong Operation Type")
        }
      }
    else if(MsgType=="1120"){
      const {OperationType,TenantId,OMSId,ClientID,Token,OrderId,OrderType} = req.body;
      const status = await client.hGet(`${TenantId}_${OMSId}`,`${ClientID}`);
      if(!status){
        res.send("Client not exists Add the Client First Then You can Order!!");
      }
      else if(OperationType==100 && (OrderType == "1" || OrderType == "2"))
        {
          try{
              const status = await client.hGet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,`${OrderId}`);
              const addData = async ()=>{
              const OrderData=JSON.stringify(req.body)
              await client.hSet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,OrderId,OrderData);
              res.send("Order received and stored in Redis");
              }
              if(!status){
                  await addData();
              }
              else res.send("Order exists");

          }
          catch(err){
              res.send("error")
          }
      }
      else if(OperationType==101 && (OrderType == "1" || OrderType == "2"))
        {
          try{
            const status = await client.hGet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,`${OrderId}`);
            const UpdateData = async ()=>{
            const OrderData=JSON.stringify(req.body)
            await client.hSet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,OrderId,OrderData);
            res.send("Order received and Updated in Redis");
          }

          
          if(status){
              await UpdateData();
          }
          else res.send("Order doesnot exist Add the Order First!!");


          }catch(err){
            res.send("error")
          }
        }
      else if(OperationType==102 && (OrderType == "1" || OrderType == "2")){
          try{
              const status = await client.hGet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,`${OrderId}`);
              const DeleteData = async ()=>{
              console.log("hello")
              await client.hDel(`${TenantId}_${OMSId}_${ClientID}_${Token}`,OrderId);
              res.send("Order deleted from Redis");
              }

              if(status){
                  await DeleteData();
              }
              else res.send("Order doesnot exist");

          }
          catch(err){
              res.send("error")
          }
      }
      else if(OperationType==103 && (OrderType == "1" || OrderType == "2")){
        const status = await client.hGet(`${TenantId}_${OMSId}_${ClientID}_${Token}`,`${OrderId}`);
        console.log(status);
        if(status){
            res.send(JSON.parse(status));
        }
        else res.send("Order doesnot exist Add the Order First!!");
      }
      else if(OperationType==104 && (OrderType == "1" || OrderType == "2")){
        const status = await client.hGetAll(`${TenantId}_${OMSId}_${ClientID}_${Token}`);
        console.log(status);
        if(status){
          res.send(status);
        }
        else res.send("Data doesnot Exist!!");
      }  
      else{
          res.send("Wrong Operation Type")
      }
    }
    else{
      res.send("Wrong MessageType");
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while Doing the Operation ");
  }
});



app.listen(3000, () => {
  console.log("Server started on port 3000");
});
