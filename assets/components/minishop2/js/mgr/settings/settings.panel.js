miniShop2.page.Settings = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		components: [{
			xtype: 'minishop2-panel-settings'
		}]
	});
	miniShop2.page.Settings.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.page.Settings,MODx.Component);
Ext.reg('minishop2-page-settings',miniShop2.page.Settings);

miniShop2.panel.Settings = function(config) {
	config = config || {};
	Ext.apply(config,{
		border: false
		,deferredRender: true
		,baseCls: 'modx-formpanel'
        ,cls: 'container'
		,items: [{
			html: '<h2>'+_('minishop2') + ' :: ' + _('ms2_settings')+'</h2>'
			,border: false
			,cls: 'modx-page-header'
		},{
			xtype: 'modx-tabs'
			,defaults: { border: false ,autoHeight: true, layout: 'anchor' }
			,border: true
			,hideMode: 'offsets'
			,stateful: true
			,stateId: 'minishop2-settings-tabpanel'
			,stateEvents: ['tabchange']
			,getState:function() {return { activeTab:this.items.indexOf(this.getActiveTab())};}
			,items: [{
				title: _('ms2_deliveries')
				,deferredRender: true
				,items: [{
					html: '<p>'+_('ms2_deliveries_intro')+'</p>'
					,border: false
					,bodyCssClass: 'panel-desc'
				},{
					xtype: 'minishop2-grid-delivery'
                    ,cls: 'main-wrapper'
				}]
			},{
				title: _('ms2_payments')
				,deferredRender: true
				,items: [{
					html: '<p>'+_('ms2_payments_intro')+'</p>'
					,border: false
					,bodyCssClass: 'panel-desc'
				},{
					xtype: 'minishop2-grid-payment'
                    ,cls: 'main-wrapper'
				}]
			},{
				title: _('ms2_statuses')
				,deferredRender: true
				,items: [{
					html: '<p>'+_('ms2_statuses_intro')+'</p>'
					,border: false
					,bodyCssClass: 'panel-desc'
				},{
					xtype: 'minishop2-grid-status'
                    ,cls: 'main-wrapper'
				}]
			},{
				title: _('ms2_vendors')
				,deferredRender: true
				,items: [{
					html: '<p>'+_('ms2_vendors_intro')+'</p>'
					,border: false
					,bodyCssClass: 'panel-desc'
				},{
					xtype: 'minishop2-grid-vendor'
                    ,cls: 'main-wrapper'
				}]
			},{
				title: _('ms2_links')
				,deferredRender: true
				,items: [{
					html: '<p>'+_('ms2_links_intro')+'</p>'
					,border: false
					,bodyCssClass: 'panel-desc'
				},{
					xtype: 'minishop2-grid-link'
                    ,cls: 'main-wrapper'
				}]
			}]
		}]
	});
	miniShop2.panel.Settings.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.panel.Settings,MODx.Panel);
Ext.reg('minishop2-panel-settings',miniShop2.panel.Settings);
