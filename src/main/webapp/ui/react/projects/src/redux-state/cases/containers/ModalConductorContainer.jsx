import {ModalConductor} from '../../../react-views/common/components/elements/ModalConductor.jsx';
import {connect} from 'react-redux';


/**
 *
 * @desc - A way to switch modals
 * @param {Object} props - properties passed in
 * @return {JSX} - switchable modal contents
 *
 **/
export default connect(state => state)(ModalConductor);
