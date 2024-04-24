node {
  stage('Pull Git') {
    checkout scm
  }
  // stage('SonarQube Analysis') {
  //   def scannerHome = tool 'SonarQube';
  //   withSonarQubeEnv("SonarQube") {
  //     sh "${scannerHome}/bin/sonar-scanner"
  //   }
  // }
  stage('Build Module Auth') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/auth/
        lerna bootstrap
        lerna run build --stream --parallel
        cd /var/lib/jenkins/workspace/omnix-development/packages/auth/pages/
        rsync -avz -e 'ssh -p 2295' change-password-expired/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' login/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' forgot-password/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' update-profile/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' auks-form/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' auks-form-login/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
        rsync -avz -e 'ssh -p 2295' logout/dist/ itops@10.194.177.111:/var/www/html/onx/js/auth/
      '''
    }
  }
  stage('Build Module Customer') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/customers/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/customers/pages/
        rsync -avz -e 'ssh -p 2295' customer/dist/ itops@10.194.177.111:/var/www/html/onx/js/customer/
        rsync -avz -e 'ssh -p 2295' customer-aside/dist/ itops@10.194.177.111:/var/www/html/onx/js/customer/
        rsync -avz -e 'ssh -p 2295' customer-detail/dist/ itops@10.194.177.111:/var/www/html/onx/js/customer/
        rsync -avz -e 'ssh -p 2295' customer-list/dist/ itops@10.194.177.111:/var/www/html/onx/js/customer/
      '''
    }
  }
  stage('Build Module Dashboard') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/dashboard/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/dashboard/pages/
        rsync -avz -e 'ssh -p 2295' dashboard/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-agent-perfomance/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-header/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-interval-channel/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-status-ticket/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-summary-channel/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-total-call/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-summary-call/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
        rsync -avz -e 'ssh -p 2295' dashboard-sales-campaign/dist/ itops@10.194.177.111:/var/www/html/onx/js/dashboard/
      '''
    }
  }
  stage('Build Module General') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/general/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/general/pages/
        rsync -avz -e 'ssh -p 2295' default-pages/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' base-alert/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' base-modal/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' base-text-editor/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' phone-number/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' drawer-journey-interactions/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' journey/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' root/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' service-journey-ticket/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' ticket/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' ticket-modal/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' faq-content/dist/ itops@10.194.177.111:/var/www/html/onx/js/general/
        rsync -avz -e 'ssh -p 2295' root/dist/index.html itops@10.194.177.111:/var/www/html/onx/
      '''
    }
  }
  stage('Build Module Logs') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs/pages/
        rsync -avz -e 'ssh -p 2295' log/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs/
        rsync -avz -e 'ssh -p 2295' log-list-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs/
        rsync -avz -e 'ssh -p 2295' log-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs/
        rsync -avz -e 'ssh -p 2295' log-journey/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs/
      '''
    }
  }

  stage('Build Module Logs Follow Up') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs-follow-up/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs-follow-up/pages/
        rsync -avz -e 'ssh -p 2295' log/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-follow-up/
        rsync -avz -e 'ssh -p 2295' log-list-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-follow-up/
        rsync -avz -e 'ssh -p 2295' log-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-follow-up/
        rsync -avz -e 'ssh -p 2295' log-journey/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-follow-up/
      '''
    }
  }

  stage('Build Module Outbound') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/outbound/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/outbound/pages/
        rsync -avz -e 'ssh -p 2295' outbound/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
        rsync -avz -e 'ssh -p 2295' outbound-call/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
        rsync -avz -e 'ssh -p 2295' outbound-detail/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
        rsync -avz -e 'ssh -p 2295' outbound-profile/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
        rsync -avz -e 'ssh -p 2295' outbound-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
        rsync -avz -e 'ssh -p 2295' outbound-transfer/dist/ itops@10.194.177.111:/var/www/html/onx/js/outbound/
      '''
    }
  }
  stage('Build Module Service') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/services/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/services/pages/
        rsync -avz -e 'ssh -p 2295' service/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-aside-case/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-aside-customer-profile/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-aside-customer-search/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-aside-ticket/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-detail-case/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-email/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-email-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-email-reply/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-contact_us/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-contact_us-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-contact_us-reply/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-facebook/dist/ itops@10.194.177.111:/var/www/html/onx/js/services
        rsync -avz -e 'ssh -p 2295' service-body-facebook-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-twitter/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-twitter-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-feed/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-feed-history/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-header/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-voice/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-video-call/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-manual/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-body-meta/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-sidebar-video-call/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-channel-icons/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-edit-customer/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-footer/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-footer-memo/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-list-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-merge-customer/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-sidebar-voice/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-sidebar-channel/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
        rsync -avz -e 'ssh -p 2295' service-sidebar-channel/dist/ itops@10.194.177.111:/var/www/html/onx/js/services/
      '''
    }
  }
  stage('Build Module Ticketing') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/ticketing/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/ticketing/pages/
        rsync -avz -e 'ssh -p 2295' ticketing/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-body/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-detail-activities/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-detail-additional/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-detail-header/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-detail-stage/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-followup-journey/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-header/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-history-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-list-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-tab/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
        rsync -avz -e 'ssh -p 2295' ticketing-service-journey/dist/ itops@10.194.177.111:/var/www/html/onx/js/ticketing/
      '''
    }
  }
  stage('Build Module Log Ticket') {
    nodejs(nodeJSInstallationName: 'nodejs') {
      sh '''
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs-ticket/
        lerna bootstrap
        lerna run build --stream --parallel 
        cd /var/lib/jenkins/workspace/omnix-development/packages/logs-ticket/pages/
        rsync -avz -e 'ssh -p 2295' log-ticket/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-ticket/
        rsync -avz -e 'ssh -p 2295' log-ticket-list-item/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-ticket/
        rsync -avz -e 'ssh -p 2295' log-ticket-sidebar/dist/ itops@10.194.177.111:/var/www/html/onx/js/logs-ticket/
      '''
    }
  }
}