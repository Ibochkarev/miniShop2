miniShop2.grid.Discount = function(config) {
	config = config || {};

	this.exp = new Ext.grid.RowExpander({
		expandOnDblClick: false
		,tpl : new Ext.Template('<p class="desc">{description}</p>')
		,renderer : function(v, p, record){return record.data.description != '' && record.data.description != null ? '<div class="x-grid3-row-expander">&#160;</div>' : '&#160;';}
	});
	this.dd = function(grid) {
		new Ext.dd.DropTarget(grid.container, {
			ddGroup : 'dd',
			copy:false,
			notifyDrop : function(dd, e, data) {
				var store = grid.store.data.items;
				var target = store[dd.getDragData(e).rowIndex].id;
				var source = store[data.rowIndex].id;
				if (target != source) {
					dd.el.mask(_('loading'),'x-mask-loading');
					MODx.Ajax.request({
						url: miniShop2.config.connector_url
						,params: {
							action: config.action || 'mgr/settings/discount/sort'
							,source: source
							,target: target
						}
						,listeners: {
							success: {fn:function(r) {dd.el.unmask();grid.refresh();},scope:grid}
							,failure: {fn:function(r) {dd.el.unmask();},scope:grid}
						}
					});
				}
			}
		});
	};

	Ext.applyIf(config,{
		id: 'minishop2-grid-discount'
		,url: miniShop2.config.connector_url
		,baseParams: {
			action: 'mgr/settings/discount/getlist'
		}
		,fields: ['id','name','descriptionn','price','weight_price','distance_price','logo','active','class','payments','requires']
		,autoHeight: true
		,paging: true
		,remoteSort: true
		,save_action: 'mgr/settings/discount/updatefromgrid'
		,autosave: true
		,plugins: this.exp
		,columns: [this.exp
			,{header: _('ms2_id'),dataIndex: 'id',width: 50}
			,{header: _('ms2_name'),dataIndex: 'name',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
			,{header: _('ms2_price'),dataIndex: 'price',width: 50, editor: {xtype: 'numberfield', decimalPrecision: 2, allowBlank: false}}
			,{header: _('ms2_weight_price'),dataIndex: 'weight_price',width: 50, editor: {xtype: 'numberfield', decimalPrecision: 2}}
			,{header: _('ms2_distance_price'),dataIndex: 'distance_price',width: 50, editor: {xtype: 'numberfield', decimalPrecision: 2}}
			,{header: _('ms2_logo'),dataIndex: 'logo',width: 75, renderer: this.renderLogo}
			,{header: _('ms2_active'),dataIndex: 'active',width: 50, editor: {xtype: 'combo-boolean', renderer: 'boolean'}}
			,{header: _('ms2_class'),dataIndex: 'class',width: 75, editor: {xtype: 'textfield'}}
		]
		,tbar: [{
			text: _('ms2_btn_create')
			,handler: this.createDiscount
			,scope: this
		}]
		,ddGroup: 'dd'
		,enableDragDrop: true
		,listeners: {render: {fn: this.dd, scope: this}}
	});
	miniShop2.grid.Discount.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.Discount,MODx.grid.Grid,{
	windows: {}

	,getMenu: function() {
		var m = [];
		m.push({
			text: _('ms2_menu_update')
			,handler: this.updateDiscount
		});
		m.push('-');
		m.push({
			text: _('ms2_menu_remove')
			,handler: this.removeDiscount
		});
		this.addContextMenuItem(m);
	}

	,renderLogo: function(value) {
		if (/(jpg|png|gif|jpeg)$/i.test(value)) {
			if (!/^\//.test(value)) {value = '/' + value;}
			return '<img src="'+value+'" height="35" />';
		}
		else {
			return '';
		}
	}

	,createDiscount: function(btn,e) {
		var w = Ext.getCmp('minishop2-window-discount-create');
		if (w) {w.hide().getEl().remove();}
		//if (!this.windows.createDiscount) {
			this.windows.createDiscount = MODx.load({
				xtype: 'minishop2-window-discount-create'
				,id: 'minishop2-window-discount-create'
				,fields: this.getDiscountFields('create', {})
				,listeners: {
					success: {fn:function() { this.refresh(); },scope:this}
					,hide: {fn:function() {this.getEl().remove()}}
				}
			});
		//}
		this.windows.createDiscount.fp.getForm().reset();
		this.windows.createDiscount.show(e.target);
	}
	,updateDiscount: function(btn,e) {
		if (!this.menu.record || !this.menu.record.id) return false;
		var r = this.menu.record;

		var w = Ext.getCmp('minishop2-window-discount-update');
		if (w) {w.hide().getEl().remove();}
		//if (!this.windows.updateDiscount) {
			this.windows.updateDiscount = MODx.load({
				xtype: 'minishop2-window-discount-update'
				,id: 'minishop2-window-discount-update'
				,record: r
				,fields: this.getDiscountFields('update', r)
				,listeners: {
					success: {fn:function() {this.refresh();},scope:this}
					,hide: {fn:function() {this.getEl().remove()}}
				}
			});
		//}
		this.windows.updateDiscount.fp.getForm().reset();
		this.windows.updateDiscount.fp.getForm().setValues(r);
		this.windows.updateDiscount.show(e.target);
		this.enablePayments(r.payments);
	}

	,removeDiscount: function(btn,e) {
		if (!this.menu.record) return false;

		MODx.msg.confirm({
			title: _('ms2_menu_remove') + '"' + this.menu.record.name + '"'
			,text: _('ms2_menu_remove_confirm')
			,url: this.config.url
			,params: {
				action: 'mgr/settings/discount/remove'
				,id: this.menu.record.id
			}
			,listeners: {
				success: {fn:function(r) {this.refresh();}, scope:this}
			}
		});
	}

	,getDiscountFields: function(type) {
		var fields = [];
		fields.push({xtype: 'hidden',name: 'id', id: 'minishop2-discount-id-'+type}
			,{xtype: 'textfield',fieldLabel: _('ms2_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-discount-name-'+type}
			,{xtype: 'numberfield',fieldLabel: _('ms2_price'), name: 'price', description: _('ms2_price_help') ,allowBlank: false, decimalPrecision: 2, anchor: '50%', id: 'minishop2-discount-price-'+type}
			,{xtype: 'numberfield',fieldLabel: _('ms2_weight_price'), description: _('ms2_weight_price_help'), name: 'weight_price', decimalPrecision: 2, allowBlank: true, anchor: '50%', id: 'minishop2-discount-weight_price-'+type}
			,{xtype: 'numberfield',fieldLabel: _('ms2_distance_price'), description: _('ms2_distance_price_help'), name: 'distance_price', decimalPrecision: 2, allowBlank: true, anchor: '50%', id: 'minishop2-discount-distance_price-'+type}
			,{xtype: 'minishop2-combo-browser',fieldLabel: _('ms2_logo'), name: 'logo', anchor: '99%',  id: 'minishop2-discount-logo-'+type}
			,{xtype: 'textarea', fieldLabel: _('ms2_description'), name: 'description', anchor: '99%', id: 'minishop2-discount-description-'+type}
			,{xtype: 'textfield', fieldLabel: _('ms2_order_requires'), description: _('ms2_order_requires_help'), name: 'requires',anchor: '99%', id: 'minishop2-discount-requires-'+type}
		);
		var payments = this.getAvailablePayments();
		if (payments.length > 0) {
			fields.push(
				{xtype: 'checkboxgroup'
					,fieldLabel: _('ms2_payments')
					,columns: 2
					,items: payments
					,id: 'minishop2-discount-payments-'+type
				}
			);
		}
		fields.push(
			{xtype: 'textfield',fieldLabel: _('ms2_class'), name: 'class', anchor: '99%', id: 'minishop2-discount-class-'+type}
			,{xtype: 'xcheckbox', fieldLabel: '', boxLabel: _('ms2_active'), name: 'active', id: 'minishop2-discount-active-'+type}
		);

		return fields;
	}

	,getAvailablePayments: function() {
		var payments = [];
		var items = miniShop2.PaymentsArray;
		for (i in items) {
			if (items.hasOwnProperty(i)) {
				var id = items[i].id;
				payments.push({
					xtype: 'xcheckbox'
					,boxLabel: items[i].name
					,name: 'payments['+id+']'
					,payment_id: id
				});
			}
		}
		return payments;
	}

	,enablePayments: function(payments) {
		if (payments.length < 1) {return;}
		var checkboxgroup = Ext.getCmp('minishop2-discount-payments-update');
		Ext.each(checkboxgroup.items.items, function(item) {
			if (payments[item.payment_id] == 1) {
				item.setValue(true);
			}
			else {
				item.setValue(false);
			}
		});
	}
});
Ext.reg('minishop2-grid-discount',miniShop2.grid.Discount);




miniShop2.window.CreateDiscount = function(config) {
	config = config || {};
	this.ident = config.ident || 'mecitem'+Ext.id();
	Ext.applyIf(config,{
		title: _('ms2_menu_create')
		,id: this.ident
		,width: 600
		,labelAlign: 'left'
		,labelWidth: 180
		,url: miniShop2.config.connector_url
		,action: 'mgr/settings/discount/create'
		,fields: config.fields
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	miniShop2.window.CreateDiscount.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.CreateDiscount,MODx.Window);
Ext.reg('minishop2-window-discount-create',miniShop2.window.CreateDiscount);


miniShop2.window.UpdateDiscount = function(config) {
	config = config || {};
	this.ident = config.ident || 'meuitem'+Ext.id();
	Ext.applyIf(config,{
		title: _('ms2_menu_update')
		,id: this.ident
		,width: 600
		,labelAlign: 'left'
		,labelWidth: 180
		,url: miniShop2.config.connector_url
		,action: 'mgr/settings/discount/update'
		,fields: config.fields
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	miniShop2.window.UpdateDiscount.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.UpdateDiscount,MODx.Window);
Ext.reg('minishop2-window-discount-update',miniShop2.window.UpdateDiscount);