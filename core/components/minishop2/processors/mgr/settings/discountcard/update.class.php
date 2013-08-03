<?php

class msDiscountCardUpdateProcessor extends modObjectUpdateProcessor {
	public $classKey = 'msDiscountCardCard';
	public $languageTopics = array('minishop2');
	public $permission = 'edit_document';

	public function beforeSet() {
		if ($this->modx->getObject('msDiscountCardCard',array('uid' => $this->getProperty('uid'), 'id:!=' => $this->getProperty('id') ))) {
			$this->modx->error->addField('uid', $this->modx->lexicon('ms2_err_ae'));
		}
		return !$this->hasErrors();
	}

	// public function afterSave() {
	// 	$delivery_id = $this->object->get('id');
	// 	$this->modx->exec("DELETE FROM {$this->modx->getTableName('msDeliveryMember')} WHERE `delivery_id` = {$delivery_id};");

	// 	/* @var msDeliveryMember $entry */
	// 	$payments = $this->getProperty('payments');
	// 	if (!empty($payments) && is_array($payments)) {
	// 		foreach ($payments as $payment => $v) {
	// 			if ($v == 1) {
	// 				$entry = $this->modx->newObject('msDeliveryMember');
	// 				$entry->fromArray(array(
	// 					'delivery_id' => $delivery_id
	// 					,'payment_id' => $payment
	// 				), '', true);
	// 				$entry->save();
	// 			}
	// 		}
	// 	}

	// 	return parent::afterSave();
	// }

}

return 'msDiscountCardUpdateProcessor';