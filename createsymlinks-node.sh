echo 'Removing symbolic links - Angular'
rm -rf public/angularjs/controllers/base
rm -rf public/angularjs/directives/base
rm -rf public/angularjs/entities/base
rm -rf public/angularjs/external/base
rm -rf public/angularjs/factories/base
rm -rf public/angularjs/modules/base
rm -rf public/angularjs/services/base
rm -rf public/angularjs/filters/base

# echo 'Creating symbolic links - Angular'
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/controllers/ public/angularjs/controllers/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/directives/ public/angularjs/directives/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/entities/ public/angularjs/entities/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/external/ public/angularjs/external/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/factories/ public/angularjs/factories/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/modules/ public/angularjs/modules/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/services/ public/angularjs/services/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/public/angularjs/filters public/angularjs/filters/base

echo 'Removing symbolic links - CSS, Images, JS & Repos files'
rm -rf assets/less/base
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/assets/less/ assets/less/base

echo 'Removing symbolic links - CSS, Images, JS & Repos files'
rm -rf public/css/base
rm -rf public/fonts/base
rm -rf public/images/base
rm -rf public/js/base
rm -rf public/repos/base

echo 'Creating symbolic links - CSS, Images, JS & Repos files'
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/public/css/ public/css/base
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/public/fonts/ public/fonts/base
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/public/images/ public/images/base
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/public/js/ public/js/base
# ln -s /app/node_modules/@mycloudcinema/projectx-base/public/repos/ public/repos/base

echo 'Removing symbolic links - HTML Templates'
rm -rf assets/pagetemplates/_templates/base
rm -rf assets/pagetemplates/base

echo 'Creating symbolic links - HTML Templates'
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/assets/pagetemplates/ assets/pagetemplates/base
ln -s ../../../app/node_modules/@mycloudcinema/projectx-base/assets/pagetemplates/_templates assets/pagetemplates/_templates/base

echo 'Removing symbolic links - Script Templates'
rm -rf assets/scripttemplates/base

echo 'Creating symbolic links - Script Templates'
ln -s ../../app/node_modules/@mycloudcinema/projectx-base/assets/scripttemplates assets/scripttemplates/base

echo 'Removing symbolic links - Webservices'
rm -rf webservices/base

echo 'Creating symbolic links - Webservices'
ln -s ../app/node_modules/@mycloudcinema/projectx-base/webservices webservices/base
