import { assign } from 'lodash';

export const fromMongo = (item) => {
	return assign(item, { id: item._id.toString() });
};

export const toMongo = (item) => {
	return assign(item, {
		_id: ObjectID(item.id)
	});
};
