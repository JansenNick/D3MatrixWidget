## Matrix
Widget to visualize data in an adjacency matrix

## Features
- Matrix visualization of network data
- Grouping
- 5 Sorting algorithms
- Selection of nodes

## Usage
- See test project in `tests/testProject9` for example setup
- Create a Node entity and give it an ID, NodeLabel and Group attribute (all strings).
- Create a Link entity and give it a SourceID and TargetID attribute.
- These entities will represent your network, make sure the Node IDs are unique, and the SourceID and TargetID in the Link entity reference these Node IDs.
- Create a MatrixWrapper non-persistent entity that has an attribute SortAlgorithm, this attribute should be an enum containing the values: group, leafOrder, name, none, rcm, spectral.
- Where you want to put the widget on a page, first create an dataview that has this MatrixWrapper object as a datasource.
- Put the widget in this dataview and set all the values in the Data tab.
- In the Styling tab you can toggle the animation of the sort algorithm and configure the size of the matrix.

## Demo project
- See test project in `tests/testProject9`

## Issues, suggestions and feature requests
[link to GitHub issues](https://github.com/JansenNick/D3MatrixWidget/issues)

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.
