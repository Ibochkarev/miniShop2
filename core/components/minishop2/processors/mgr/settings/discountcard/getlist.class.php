<?php

class msDiscountCardGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msDiscountCardCard';
	public $defaultSortField = 'id';
	public $defaultSortDirection  = 'asc';

	// public function prepareQueryBeforeCount(xPDOQuery $c) {
	// 	if ($this->getProperty('combo')) {
	// 		$c->select('id,name');
	// 		$c->where(array('active' => 1));
	// 	}
	// 	return $c;
	// }

	// public function prepareRow(xPDOObject $object) {
	// 	$array = $object->toArray();

	// 	$payments = $object->getMany('Payments');
	// 	$enabled = array();
	// 	foreach ($payments as $payment) {
	// 		$enabled[$payment->get('payment_id')] = 1;
	// 	}

	// 	$array['payments'] = $enabled;

	// 	return $array;
	// }

}

return 'msDiscountCardGetListProcessor';