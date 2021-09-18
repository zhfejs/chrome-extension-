import PointWave from './src/main.vue'

PointWave.install = function(Vue) {
  Vue.component(PointWave.name, PointWave);
};

export default PointWave;