echo 'Removing symbolic links - Angular'
rm -rf assets/angular/controllers/base
rm -rf assets/angular/directives/base
rm -rf assets/angular/entities/base
rm -rf assets/angular/external/base
rm -rf assets/angular/factories/base
rm -rf assets/angular/modules/base
rm -rf assets/angular/services/base
rm -rf assets/angular/filters/base

	echo 'Removing symbolic links - CSS, Images, JS & Repos files'
rm -rf public/css/base
rm -rf public/fonts/base
rm -rf public/images/base
rm -rf public/js/base
rm -rf public/repos/base



echo 'Removing symbolic links - CSS, Images, JS & Repos files'
rm -rf assets/less/base
ln -s ~/Git/projectx/projectx-base/less/ assets/less/base

echo 'Removing symbolic links - HTML Templates'
rm -rf assets/pagetemplates/_templates/base
rm -rf assets/pagetemplates/base

echo 'Creating symbolic links - HTML Templates'
ln -s ~/Git/projectx/projectx-base/assets/pagetemplates/ assets/pagetemplates/base
ln -s ~/Git/projectx/projectx-base/assets/pagetemplates/_templates/ assets/pagetemplates/_templates/base

echo 'Removing symbolic links - Script Templates'
rm -rf assets/scripttemplates/base

echo 'Creating symbolic links - Script Templates'
ln -s ~/Git/projectx/projectx-base/assets/scripttemplates/ assets/scripttemplates/base

echo 'Removing symbolic links - Webservices'
rm -rf webservices/base

echo 'Creating symbolic links - Webservices'
ln -s ~/Git/projectx/projectx-base/webservices webservices/base
