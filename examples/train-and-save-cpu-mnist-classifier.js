const {
  NetworkBuilder: { NetworkBuilder1D },
  Layer: { LogisticLayer, ReluLayer },
  Optimizer: { OptimizerGradientDescent, OptimizerAdam, OptimizerMomentum, OptimizerRMSProp },
  Trainer: { MiniBatchTrainer, Trainer },
} = require("impulse-ts");
const {
  DatasetBuilder: { DatasetBuilder },
  DatasetModifier: {
    MinMaxScalingDatasetModifier,
    MissingDataScalingDatasetModifier,
    ShuffleDatasetModifier,
    SplitDatasetModifier,
    CategoryDatasetModifier,
  },
  DatasetBuilderSource: { DatasetBuilderSourceCSV },
} = require("impulse-dataset-ts");
const path = require("path");

const builder = new NetworkBuilder1D([28 * 28]);
builder
  .createLayer(ReluLayer, (layer) => {
    layer.setSize(100);
  })
  .createLayer(LogisticLayer, (layer) => {
    layer.setSize(10);
  });

const network = builder.getNetwork();

DatasetBuilder.fromSource(DatasetBuilderSourceCSV.fromLocalFile(path.resolve(__dirname, "./data/mnist.csv"))).then(
  async (dataset) => {
    let [outputDataset, inputDataset] = new SplitDatasetModifier([0]).apply(dataset);

    outputDataset = new CategoryDatasetModifier([0]).apply(outputDataset);

    inputDataset = new MinMaxScalingDatasetModifier().apply(inputDataset);
    inputDataset = new MissingDataScalingDatasetModifier().apply(inputDataset);
    const shuffle = new ShuffleDatasetModifier(inputDataset);

    inputDataset = shuffle.apply(inputDataset);
    outputDataset = shuffle.apply(outputDataset);

    const trainer = new MiniBatchTrainer(network, new OptimizerRMSProp());

    console.log(trainer.cost(inputDataset, outputDataset));

    trainer.setBatchSize(500);
    trainer.setIterations(1);
    trainer.setLearningRate(0.1);
    trainer.setRegularization(0.1);
    trainer.setStepCallback(() => {
      console.log(
        network.forward(inputDataset.exampleAt(0)).colMaxCoeffIndex(0),
        outputDataset.exampleAt(0).colMaxCoeffIndex(0)
      );
    });
    trainer.train(inputDataset, outputDataset);

    await network.save(path.resolve(__dirname, "./data/mnist.json"));
    console.log(trainer.cost(inputDataset, outputDataset));
    console.log(network.forward(inputDataset.exampleAt(0)), outputDataset.exampleAt(0));
  }
);
