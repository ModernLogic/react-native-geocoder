require('babel-core/register')({
  presets: ["react-native"]
});
import "babel-polyfill";

import 'colors';

import { use, expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
use(sinonChai);

global.expect = expect;
