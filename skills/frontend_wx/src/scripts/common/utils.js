class Utils {
  constructor() {

  }

  getSearch (href) {
    href = href || win.location.search;
    var data = {},reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
    href && href.replace(reg,function( $0, $1, $2, $3 ){
      data[ $1 ] = $3;
    });
    return data;
  }

}

export default new Utils();
