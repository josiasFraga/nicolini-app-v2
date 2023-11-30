//import IMAGES from "@constants/images";

const INITIAL_STATE = {
  is_logging_in: false,

  is_loading_goods: false,

  is_loading_collections: false,
  collections: [],

  is_loading_my_collections: false,
  my_collections: [],

  is_starting_collection: false,
  is_finishing_collection: false,

  last_scan: '',

  single_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  },
  central_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  },
  invert_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  },
  splits: [],
  is_loading_splits: false,

  stores: [],
  is_sotres_loading: false
};

export const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  
    case 'LOGIN':
		return {...state, is_logging_in: true};
    case 'LOGIN_SUCCESS':
		return {...state, is_logging_in: false};
    case 'LOGIN_FAILED':
		return {...state, is_logging_in: false};
  
    case 'LOAD_GOODS':
		return {...state, is_loading_goods: true};
    case 'LOAD_GOODS_SUCCESS':
		return {...state, is_loading_goods: false };
    case 'LOAD_GOODS_FAILED':
		return {...state, is_loading_goods: false};
  
    case 'LOAD_COLLECTIONS':
		return {...state, is_loading_collections: true, collections: []};
    case 'LOAD_COLLECTIONS_SUCCESS':
		return {...state, is_loading_collections: false, collections: action.payload };
    case 'LOAD_COLLECTIONS_FAILED':
		return {...state, is_loading_collections: false, collections: []};
  
    case 'LOAD_MY_COLLECTIONS':
		return {...state, is_loading_my_collections: true, my_collections: []};
    case 'LOAD_MY_COLLECTIONS_SUCCESS':
		return {...state, is_loading_my_collections: false, my_collections: action.payload };
    case 'LOAD_MY_COLLECTIONS_FAILED':
		return {...state, is_loading_my_collections: false, my_collections: []};
  
    case 'START_COLLECTION':
		return {...state, is_starting_collection: true};
    case 'START_COLLECTION_SUCCESS':
		return {...state, is_starting_collection: false};
    case 'START_COLLECTION_FAILED':
		return {...state, is_starting_collection: false};
  
    case 'FINISH_COLLECTION':
		return {...state, is_finishing_collection: true};
    case 'FINISH_COLLECTION_SUCCESS':
		return {...state, is_finishing_collection: false};
    case 'FINISH_COLLECTION_FAILED':
		return {...state, is_finishing_collection: false};
  
    case 'SET_SINGLE_COLLECTION_DATA':
		return {...state, single_collection_data: action.payload};
    case 'SET_CENTRAL_COLLECTION_DATA':
		return {...state, central_collection_data: action.payload};
    case 'SET_INVERT_COLLECTION_DATA':
		return {...state, invert_collection_data: action.payload};
  
    case 'LOAD_SPLITS':
		return {...state, is_loading_splits: true, splits: []};
    case 'LOAD_SPLITS_SUCCESS':
		return {...state, is_loading_splits: false, splits: action.payload };
    case 'LOAD_SPLITS_FAILED':
		return {...state, is_loading_splits: false, splits: []};
  
    case 'LOAD_STORES':
		return {...state, is_sotres_loading: true, stores: []};
    case 'LOAD_STORES_SUCCESS':
		return {...state, is_sotres_loading: false, stores: action.payload };
    case 'LOAD_STORES_FAILED':
		return {...state, is_sotres_loading: false, stores: []};
  
    case 'SET_LAST_SCAN':
		return {...state, last_scan: action.payload};
  
    default:
		return state;
  }
};
