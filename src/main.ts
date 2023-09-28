import HystModal from '../lib/hystmodal';
import './demos.css';

const m = new HystModal({
  isStacked: false,
  closeOnEsc: true,
  closeOnButton: true,
  closeOnOverlay: true,
  backscroll: true,
  waitTransitions: true,
});
m.closeAll();
