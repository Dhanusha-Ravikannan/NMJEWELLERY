// const express = require('express')
// const {PrismaClient} = require('@prisma/client')
// const prisma = new PrismaClient();

// const getAllBills = async (req,res) => {
//     try {
//         const allBills = await prisma.bills.findMany();
//         res.status(200).json(allBills)
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({error : 'No bills'})
//     }
// }

// const createBills = async (req,res) => {
//     try {

//         const randomDigit = Math.floor(1000+ Math.random()*9000);
//         const time = Date.now();

//         const bill_number = `${randomDigit}${time}`

//         const newBill = await prisma.bills.create({
//             data : {
//                 bill_number,
//                 created_at : new Date()
//             }
//         })
//         res.status(200).json(newBill)
//     } catch (error) {
//        console.log(error)
//        res.status(404).json({error : 'No bills created '})
//     }
// }

// const deleteBills = async (req,res) => {
//     try {
//         const {id} = req.params;

//         const delBill = await prisma.bills.delete({
//             where : {
//                 id : parseInt(id)
//             }
//         })
//         res.status(200).json({message : "Deleted Successfully", delBill})
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({error : "No Bills deleted"})
//     }
// }

// module.exports = {getAllBills,createBills,deleteBills}



const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getAllBills = async (req, res) => {
  try {
    const allBills = await prisma.bills.findMany();
    res.status(200).json(allBills);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No bills" });
  }
};

const createBills = async (req, res) => {
  try {
    const randomDigit = Math.floor(1000 + Math.random() * 9000);
    const time = Date();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const bill_number = `${year}-${month}-${day}----${randomDigit}`;

    const newBill = await prisma.bills.create({
      data: {
        bill_number,
        created_at: new Date(),
      },
    });

    res.status(200).json(newBill);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No bills created " });
  }
};

const deleteBills = async (req, res) => {
  try {
    const { id } = req.params;

    const delBill = await prisma.bills.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Deleted Successfully", delBill });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No Bills deleted" });
  }
};

// change hold bills to sold

const modifyBillHold = async (req, res) => {
  try {
    const { bill_number } = req.body;
    if (bill_number) {
      const bill = await prisma.bill_items.findMany({
        where: {
          bill_number: String(bill_number),
        },
        select: {
          bill_number: true,
          product_id: true,
          productInfo: true,
        },
      });
      console.log("🚀 ~ modifyBillHold ~ bill:", bill);

      const filteredHoldData = bill.filter(
        (e) => e.productInfo.product_type === "hold"
      );

      const productIdsToUpdate = filteredHoldData.map(
        (item) => item.productInfo.id
      );

      if (productIdsToUpdate.length === 0) {
        return res
          .status(400)
          .json({ msg: "No products found with type 'hold'" });
      }

      const updateResult = await prisma.product_info.updateMany({
        where: {
          id: {
            in: productIdsToUpdate,
          },
        },
        data: {
          product_type: "sold",
        },
      });

      return res
        .status(200)
        .json({ msg: "successfully modified", result: updateResult });
    } else {
      return res.status(400).json({ msg: "Unable to delete the lot" });
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = { getAllBills, createBills, deleteBills, modifyBillHold };
