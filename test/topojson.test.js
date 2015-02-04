var test = require('tape'),
    path = require('path'),
    fs = require('fs'),
    testData = path.join(path.dirname(require.resolve('mapnik-test-data')), 'data'),
    TopoJSON = require('../lib/topojson.js');

function closeEnough(assert, found, expected, message) {
  found =  Math.floor(found * Math.pow(10, 6)) / Math.pow(10, 6);
  expected =  Math.floor(expected * Math.pow(10, 6)) / Math.pow(10, 6);
  assert.equal(found, expected, message);
}

var expectedMetadata_topo = JSON.parse(fs.readFileSync(path.resolve('test/fixtures/metadata_topo.json')));

/**
 * Testing GeoJSON functions
 */
test('[TopoJson] Setting up constructor', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      expectedCenter = [-81.705583, 41.480573],
      expectedExtent = [-81.705583, 41.480573, -81.705583, 41.480573],
      expectedLayers = ['topo'],
      result = new TopoJSON(fixture);

  assert.ok(result);
  assert.ok(result.center);
  assert.ok(result.extent);
  assert.ok(typeof result.extent == 'object');
  assert.ok(typeof result.center == 'object');
  assert.ok(result instanceof TopoJSON, 'creates a Topojson instance');
  assert.equal(result.dstype, 'topojson', 'expected dstype');
  assert.deepEqual(result.center, expectedCenter);
  assert.deepEqual(result.extent, expectedExtent);
  assert.deepEqual(result.layers, expectedLayers);
  assert.end();
});

test('[TopoJson] getLayers: topojson file with layers', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      topo = new TopoJSON(fixture);

  topo.getLayers(function(err, layers) {
    assert.ifError(err, 'no error');
    assert.equal(layers.length, expectedMetadata_topo.layers.length, 'correct number of layers');
    expectedMetadata_topo.layers.forEach(function(layername) {
      assert.ok(layers.indexOf(layername) > -1, layername + ' found in layers');
    });
    assert.end();
  });
});

test('[TopoJson] getExtent: topojson file with layers', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      topo = new TopoJSON(fixture),
      expected = [-81.705583, 41.480573, -81.705583, 41.480573];

  topo.getExtent(function(err, extent) {
    assert.ifError(err, 'no error');
    extent.forEach(function(coord, i) {
      closeEnough(assert, coord, expected[i], 'correct extent value');
    });
    assert.end();
  });
});

test('[TopoJson] getCenter: topojson file with layers', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      topo = new TopoJSON(fixture),
      expected = [-81.705583, 41.480573];

  topo.getCenter(function(err, center) {
    assert.ifError(err, 'no error');
    center.forEach(function(coord, i) {
      closeEnough(assert, coord, expected[i], 'correct center value');
    });
    assert.end();
  });
});

test('[TopoJson] getProjection: topojson file with layers', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      topo = new TopoJSON(fixture),
      expected = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

  topo.getProjection(function(err, projection) {
    assert.ifError(err, 'no error');
    assert.equal(projection, expected, 'expected projection');
    assert.end();
  });
});

test('[TopoJson] getDetails: topojson file with layers', function(assert) {
  var fixture = path.join(testData, 'topojson', 'topo.json'),
      topo = new TopoJSON(fixture);

  topo.getDetails(function(err, details) {
    assert.ifError(err, 'no error');
    assert.deepEqual(details, expectedMetadata_topo.json, 'expected details');
    assert.end();
  });
});
