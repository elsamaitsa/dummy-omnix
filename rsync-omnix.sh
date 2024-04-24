#Module Auth
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/auth/pages/
rsync -avz -e 'ssh -p 52021' change-password-expired/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' login/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' forgot-password/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' update-profile/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' auks-form/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' auks-form-login/dist/ $1:/var/www/html/onx/js/auth/
rsync -avz -e 'ssh -p 52021' logout/dist/ $1:/var/www/html/onx/js/auth/

#Module Customer
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/customers/pages/
rsync -avz -e 'ssh -p 52021' customer/dist/ $1:/var/www/html/onx/js/customer/
rsync -avz -e 'ssh -p 52021' customer-aside/dist/ $1:/var/www/html/onx/js/customer/
rsync -avz -e 'ssh -p 52021' customer-detail/dist/ $1:/var/www/html/onx/js/customer/
rsync -avz -e 'ssh -p 52021' customer-list/dist/ $1:/var/www/html/onx/js/customer/

#Module Dashboard
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/dashboard/pages/
rsync -avz -e 'ssh -p 52021' dashboard/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-agent-perfomance/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-header/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-interval-channel/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-status-ticket/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-summary-channel/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-sales-campaign/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-summary-call/dist/ $1:/var/www/html/onx/js/dashboard/
rsync -avz -e 'ssh -p 52021' dashboard-total-call/dist/ $1:/var/www/html/onx/js/dashboard/

#Module General
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/general/pages/
rsync -avz -e 'ssh -p 52021' base-alert/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' base-modal/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' default-pages/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' drawer-journey-interactions/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' journey/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' root/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' service-journey-ticket/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' sidebar/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' base-text-editor/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' phone-number/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' ticket-modal/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' faq-content/dist/ $1:/var/www/html/onx/js/general/
rsync -avz -e 'ssh -p 52021' root/dist/index.html $1:/var/www/html/onx/


#Module Logs
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/logs/pages/
rsync -avz -e 'ssh -p 52021' log/dist/ $1:/var/www/html/onx/js/logs/
rsync -avz -e 'ssh -p 52021' log-list-item/dist/ $1:/var/www/html/onx/js/logs/
rsync -avz -e 'ssh -p 52021' log-sidebar/dist/ $1:/var/www/html/onx/js/logs/
rsync -avz -e 'ssh -p 52021' log-journey/dist/ $1:/var/www/html/onx/js/logs/

#Module Logs Follow Up
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/logs-follow-up/pages/
rsync -avz -e 'ssh -p 52021' log/dist/ $1:/var/www/html/onx/js/logs-follow-up/
rsync -avz -e 'ssh -p 52021' log-list-item/dist/ $1:/var/www/html/onx/js/logs-follow-up/
rsync -avz -e 'ssh -p 52021' log-sidebar/dist/ $1:/var/www/html/onx/js/logs-follow-up/
rsync -avz -e 'ssh -p 52021' log-journey/dist/ $1:/var/www/html/onx/js/logs-follow-up/

#Module Logs Ticket
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/logs-ticket/pages/
rsync -avz -e 'ssh -p 52021' log-ticket/dist/ $1:/var/www/html/onx/js/logs-ticket/
rsync -avz -e 'ssh -p 52021' log-ticket-list-item/dist/ $1:/var/www/html/onx/js/logs-ticket/
rsync -avz -e 'ssh -p 52021' log-ticket-sidebar/dist/ $1:/var/www/html/onx/js/logs-ticket/

#Module Outbound
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/outbound/pages/
rsync -avz -e 'ssh -p 52021' outbound/dist/ $1:/var/www/html/onx/js/outbound/
rsync -avz -e 'ssh -p 52021' outbound-call/dist/ $1:/var/www/html/onx/js/outbound/
rsync -avz -e 'ssh -p 52021' outbound-detail/dist/ $1:/var/www/html/onx/js/outbound/
rsync -avz -e 'ssh -p 52021' outbound-profile/dist/ $1:/var/www/html/onx/js/outbound/
rsync -avz -e 'ssh -p 52021' outbound-sidebar/dist/ $1:/var/www/html/onx/js/outbound/
rsync -avz -e 'ssh -p 52021' outbound-transfer/dist/ $1:/var/www/html/onx/js/outbound/

#Module Service
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/services/pages/
rsync -avz -e 'ssh -p 52021' service/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-aside-case/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-aside-customer-profile/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-aside-customer-search/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-aside-ticket/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-email/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-email-history/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-email-reply/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-facebook/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-facebook-history/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-feed/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-feed-history/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-header/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-history/dist/ $1:/var/www/html/onx/js/services/    
rsync -avz -e 'ssh -p 52021' service-body-twitter/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-twitter-history/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-video-call/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-body-voice/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-channel-icons/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-detail-case/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-edit-customer/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-footer/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-footer-memo/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-list-item/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-merge-customer/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-sidebar/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-sidebar-channel/dist/ $1:/var/www/html/onx/js/services/
rsync -avz -e 'ssh -p 52021' service-sidebar-video-call/dist/ $1:/var/www/html/onx/js/services/ 
rsync -avz -e 'ssh -p 52021' service-sidebar-voice/dist/ $1:/var/www/html/onx/js/services/ 

#Module Ticketing
cd /var/lib/jenkins/workspace/omnix-apps-production/packages/ticketing/pages/
rsync -avz -e 'ssh -p 52021' ticketing/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-body/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-detail-activities/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-detail-additional/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-detail-header/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-detail-stage/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-followup-journey/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-header/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-history-item/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-list-item/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-service-journey/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-sidebar/dist/ $1:/var/www/html/onx/js/ticketing/
rsync -avz -e 'ssh -p 52021' ticketing-tab/dist/ $1:/var/www/html/onx/js/ticketing/