const {
  DatasetBuilder: { DatasetBuilder },
  DatasetBuilderSource: { DatasetBuilderSourceCSV },
  DatasetModifier: { MissingDataDatasetModifier },
} = require("impulse-dataset-ts");
const path = require("path");

const testDataset = (dataset) => {
  console.log("Testing...");
  for (let row = 0; row < dataset.getExampleSize(); row += 1) {
    for (let col = 0; col < dataset.getNumberOfExamples(); col += 1) {
      if (Number.isNaN(dataset.data.data[row][col]) || typeof dataset.data.data[row][col] === "undefined") {
        console.log(`bad row ${row} ${col}`);
      }
    }
  }
  console.log("Test ended.");
};

DatasetBuilder.fromSource(DatasetBuilderSourceCSV.fromLocalFile(path.resolve(__dirname, "./data/mnist.csv"))).then(
  (dataset) => {
    console.log("Dataset loaded.");
    testDataset(dataset);
    console.log("Transforming dataset...");
    dataset = new MissingDataDatasetModifier().apply(dataset);
    console.log("Transforming dataset ended.");
    testDataset(dataset);
  }
);
