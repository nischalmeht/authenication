const express = require('express')
const connectDb = require('./db/connectDb')
const app = express()
const port = 3000
const dotenv = require("dotenv");
const auth = require('./routes/auth');
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');
const redis = require("redis");
const cors = require('cors');
dotenv.config()
app.use(express.json())
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});
client.on("error", (error) =>
  console.log("Redis client error occured!", error)

);
app.use(cors());
app.use(cookieParser())
app.use("/api/auth", auth)
// async function testRedisConnection() {
//   try {
//     await client.connect();
//     console.log("Connected to redis");
//     // await client.mSet([
//     //   "user:email",
//     //   "sangam@gmail.com",
//     //   "user:age",
//     //   "60",
//     //   "user:country",
//     //   "India",
//     // ]);
//     //  const [email, age, country] = await client.mGet([
//     //   "user:email",
//     //   "user:age",
//     //   "user:country",
//     // ]);
//     // await client.lPush("notes", ["note 1", "note 2", "note 3"]);
//     // const extractAllNotes = await client.lRange("notes", 0, -1);
//     // console.log(extractAllNotes);
//     // await client.sAdd("user:nickName", ["john", "varun", "xyz"]);
//     // const extractUserNicknames = await client.sMembers("user:nickName");
//     // console.log(extractUserNicknames);

//     // const isVarunIsOneOfUserNickName = await client.sIsMember(
//     //   "user:nickName",
//     //   "nischal"
//     // );
//     // console.log(isVarunIsOneOfUserNickName);

//     // await client.sRem("user:nickName", "xyz");

//     // const getUpdatedUserNickNames = await client.sMembers("user:nickName");
//     // console.log(getUpdatedUserNickNames);
//     //     await client.zAdd("cart", [
//     //       {
//     //         score: 100,
//     //         value: "Cart 1",
//     //       },
//     //       {
//     //         score: 150,
//     //         value: "Cart 2",
//     //       },
//     //       {
//     //         score: 10,
//     //         value: "Cart 3",
//     //       },
//     //     ]);

//     //     const getCartItems = await client.zRange("cart", 0, -1);
//     //     console.log(getCartItems,'getCartItems');
//     // //  const extractAllCartItemsWithScore = await client.zRangeWithScores(
//     // //       "cart",
//     // //       0,
//     // //       -1
//     // //     );
//     // //     console.log(extractAllCartItemsWithScore);
//     //     const cartTwoRank = await client.zRank("cart", "Cart 2");
//     //     console.log(cartTwoRank,'cartTwoRankcartTwoRank');

//     // console.log(email, age, country);
//     // await client.hSet("product:1", {
//     //   name: "Product 1",
//     //   description: "product one description",
//     //   rating: "5",
//     // });

//     // const getProductRating = await client.hGet("product:1", "rating");
//     // console.log(getProductRating,'getProductRatinggetProductRating');
//     // pipelining & transactions
//         // const multi = client.multi();

//         // multi.set("key-transaction1", "value1");
//         // multi.set("key-transaction2", "value2");
//         // multi.get("key-transaction1");
//         // multi.get("key-transaction2");

//         // const results = await multi.exec();
//         // console.log(results,'resultsresults');
//          //     //batch data operation ->
//         // const pipelineOne = client.multi()

//         // for(let i =0 ;i<1000; i++){
//         //     pipeline.set(`user:${i}:action`, `Action ${i}`)
//         // }

//         // await pipelineOne.exec()
//          console.log("Performance test");
//     console.time("without pipelining");

//     for (let i = 0; i < 1000; i++) {
//       await client.set(`user${i}`, `user_value${i}`);
//     }

// //     console.timeEnd("without pipelining");

// //     console.time("with pipelining");
// //     const bigPipeline = client.multi();

// //     for (let i = 0; i < 1000; i++) {
// //       bigPipeline.set(`user_pipeline_key${i}`, `user_pipeline_value${i}`);
// //     }

// //     await bigPipeline.exec();
// //     // console.log(bigPipeline)
// //     const keys = Array.from({ length: 1000 }, (_, i) => `user_pipeline_key${i}`);
// // const values = await client.mGet(keys);

// // console.log(values,'values')
//     console.timeEnd("with pipelining");


//   } catch (err) {
//     await client.quit();
//   }
// }
// testRedisConnection()

app.listen(port, () => {
  connectDb()
  console.log(`Example app listening on port ${port}`)
})
