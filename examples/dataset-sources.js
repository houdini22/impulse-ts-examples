const {
  DatasetBuilder: { DatasetBuilder },
  DatasetBuilderSource: { DatasetBuilderSourceCSV },
} = require("impulse-dataset-ts");
const path = require("path");

DatasetBuilder.fromSource(DatasetBuilderSourceCSV.fromLocalFile(path.resolve(__dirname, "./data/iris_x.csv"))).then(
  (inputDataset) => {
    console.log(inputDataset, inputDataset.data);
  }
);
