// import expenses from "../models/Expenses.model";
import customers from "../models/customer.model.js";
import expenses from "../models/Expenses.model.js";
import * as XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashboard = async (req, res) => {
  await customers
    .aggregate([
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: null,
            customers: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      {
                        $eq: ["$Deleted", false],
                      },
                      {
                        $eq: ["$Activate", true],
                      },
                    ],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
      },
      {
        $unionWith:
          /**
           * coll: The collection name.
           * pipeline: The pipeline on the other collection.
           */
          {
            coll: "users",
            pipeline: [
              {
                $group:
                  /**
                   * _id: The id of the group.
                   * fieldN: The first field name.
                   */
                  {
                    _id: null,
                    Users: {
                      $sum: {
                        $cond: {
                          if: {
                            $and: [
                              {
                                $eq: ["$Deleted", false],
                              },
                              {
                                $eq: ["$Activate", true],
                              },
                            ],
                          },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                  },
              },
            ],
          },
      },
      {
        $unionWith: {
          coll: "expenses",
          pipeline: [
            {
              $group: {
                _id: null,
                Bills: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ["$Deleted", false],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                ApprovedBills: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $eq: ["$Approval_Manager", true],
                          },
                          {
                            $eq: ["$Approval_HOD", true],
                          },
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                TotalAmount: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ["$Deleted", false],
                      },
                      then: {
                        $toDouble: "$Amount",
                      },
                      else: 0,
                    },
                  },
                },

                Approved_Amount: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $eq: ["$Approval_Manager", true],
                          },
                          {
                            $eq: ["$Approval_HOD", true],
                          },
                        ],
                      },
                      then: {
                        $toDouble: "$Amount",
                      },
                      else: 0,
                    },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                Bills: 1,
                ApprovedBills: 1,
                Approved_Amount: 1,
                TotalAmount: {
                  $cond: {
                    if: {
                      $eq: ["$Bills", 0],
                    },
                    then: 0,
                    else: "$TotalAmount",
                  },
                },
              },
            },
          ],
        },
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: null,
            mergedData: {
              $mergeObjects: "$$ROOT",
            },
          },
      },
    ])
    .then((re) => {
      return res.status(200).json({ message: re });
    })
    .catch((err) => {
      return res.status(400).json({ message: "field to process the query" });
    });
};

const Excelfile_Download = async (req, res) => {
  const { from, to } = req.body;
  await expenses
    .find({
      Deleted: false,
      Expense_date: {
        $gte: from,
        $lte: to,
      },
    })
    .then((re) => {
      let transformdata = re.map((finding) => {
        const {
          _id,
          Customer,
          Expense_raiser,
          Address,
          Department,
          Expense_date,
          Expense_type,
          Location_from,
          Location_to,
          Otherinfo,
          Amount,
          Description,
          Vehicle,
          Company_name,
        } = finding;
        return {
          Id: _id.toString(),
          Customer: Customer.toString(),
          ExpenseRaiser: Expense_raiser.toString(),
          Customer_Address: Address,
          Department: Department,
          Expense_date: Expense_date,
          ExpenseType: Expense_type,
          Vehicle: Vehicle,
          LocationFrom: Location_from,
          LocationTo: Location_to,
          Otherinfo: Otherinfo,
          Amount: Amount,
          Description: Description,
          Company: Company_name,
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(transformdata);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");
      const filePath = path.resolve(__dirname, `../Expense.xlsx`);
      XLSX.writeFile(workbook, "Expense.xlsx");
      console.log(filePath);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Expense.xlsx"`
      );
      res.download(filePath, (err) => {
        if (err) {
          console.log("Error downloading file:", err);
          res.status(500).send("Error downloading file.");
        }
        fs.unlinkSync("./Expense.xlsx");
      });
    });
};

export { dashboard, Excelfile_Download };
