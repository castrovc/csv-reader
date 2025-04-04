import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const app = express();
const port = 8080;

app.use(cors());

const upload = multer({ dest: "uploads/" });

interface CSVRow {
  id: number;
  name: string;
  code: string;
  description: string;
  subCategory: number;
  supplierId: number;
  tipoItem: number;
  tipoDeItem: string;
  uniMedida: string;
  unidaDeMedida: string;
  stock: number;
  minimumStock: number;
  costoUnitario: number;
  branchId: number;
  price: number;
  priceA: number;
  priceB: number;
  priceC: number;
}

app.post("/upload-csv", upload.single("file"), (req: Request, res: Response) => {
  const results: Array<CSVRow> = [];

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let index = 0;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row: any) => {
      index++;
      console.log(row.price);
      results.push({
        id: index,
        name: `${row.name} ${row.description !== 'UNIDAD' ? row.description : ''}`,
        code: '',
        description: row.description,
        subCategory: 173,
        supplierId: 74,
        tipoItem: 1,
        tipoDeItem: 'Bienes',
        uniMedida: '59',
        unidaDeMedida: 'Unidad',
        stock: row.stock,
        minimumStock: 0,
        costoUnitario: 0.1,
        branchId: 15,
        price: Number(row.price),
        priceA: 0,
        priceB: 0,
        priceC: 0
      });
    })
    .on("end", () => {
      fs.unlinkSync(filePath);
      res.json(results);
    })
    .on("error", (error: Error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
