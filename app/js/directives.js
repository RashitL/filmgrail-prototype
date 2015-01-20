'use strict';

var appDirectives = angular.module('appDirectives', []);

appDirectives.directive('inoFocus', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.inoFocus,
          function (newValue) {
              if (newValue) {
                  element.parent().removeClass('hidden');
                  element.parent().removeClass('ng-hide');
                  element.focus();
              } else {
                  element.parent().addClass('hidden');
              }
          }, true);
    };
});

appDirectives.directive('backImg', function () {
    return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
            element.css({
                'background-image': 'url(' + value + ')',
                'background-size': 'cover'
            });
        });
    };
});

appDirectives.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });

            attrs.$observe('ngSrc', function (value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});


appDirectives.directive('angularte', function () {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function (scope, element, attrs, ngModel) {
            $(element).focus(function () {
                $(function () {
                    element.jqte({
                        // On focus show the toolbar
                        focus: function () {
                            scope.$apply(function () {
                                element.parents(".jqte").find(".jqte_toolbar").show();
                                element.parents(".jqte").click(function () { element.parents(".jqte").find(".jqte_toolbar").show(); });
                                if (element.parents(".jqte").find(".jqte_editor")[0].innerHTML.length == 0)
                                    element.parents(".jqte").find(".jqte_editor")[0].innerHTML = ngModel.$viewValue = attrs.angularte;
                            });
                        },
                        // On change refresh the model with the textarea value
                        change: function () {
                            scope.$apply(function () {
                                ngModel.$setViewValue(element.parents(".jqte").find(".jqte_editor")[0].innerHTML);
                            });
                        }
                    });
                    if (element.val() == "") {
                        element.parents(".jqte").find(".jqte_editor").focus();
                    }
                });

                // On render refresh the textarea with the model value 
                ngModel.$render = function () {
                    element.parents(".jqte").find(".jqte_editor")[0].innerHTML = ngModel.$viewValue || '';
                };
            });
        }
    };
});


appDirectives.directive('angulartehtml', function () {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.$apply(function () {
                element.parents(".jqte").find(".jqte_toolbar").show();
                element.parents(".jqte").click(function () { element.parents(".jqte").find(".jqte_toolbar").show(); });
                //element.parents(".jqte").find(".jqte_editor")[0].innerHTML=ngModel.$viewValue = attrs.angularte;
            });

            ngModel.$render = function () {
                element.parents(".jqte").find(".jqte_editor")[0].innerHTML = ngModel.$viewValue || '';
            };

            element.jqte({
                // On focus show the toolbar
                focus: function () {
                    scope.$apply(function () {
                        element.parents(".jqte").find(".jqte_toolbar").show();
                        element.parents(".jqte").click(function () { element.parents(".jqte").find(".jqte_toolbar").show(); });
                        //element.parents(".jqte").find(".jqte_editor")[0].innerHTML=ngModel.$viewValue = attrs.angularte;
                    });
                },
                // On change refresh the model with the textarea value
                change: function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(element.parents(".jqte").find(".jqte_editor")[0].innerHTML);
                    });
                }
            });
            if (element.val() == "") {
                element.parents(".jqte").find(".jqte_editor").focus();
            }

            $(element).focus(function () {
                $(function () {
                    element.jqte({
                        // On focus show the toolbar
                        focus: function () {
                            scope.$apply(function () {
                                element.parents(".jqte").find(".jqte_toolbar").show();
                                element.parents(".jqte").click(function () { element.parents(".jqte").find(".jqte_toolbar").show(); });
                                //element.parents(".jqte").find(".jqte_editor")[0].innerHTML=ngModel.$viewValue = attrs.angularte;
                            });
                        },
                        // On change refresh the model with the textarea value
                        change: function () {
                            scope.$apply(function () {
                                ngModel.$setViewValue(element.parents(".jqte").find(".jqte_editor")[0].innerHTML);
                            });
                        }
                    });
                    if (element.val() == "") {
                        element.parents(".jqte").find(".jqte_editor").focus();
                    }
                });

                // On render refresh the textarea with the model value 
                ngModel.$render = function () {
                    element.parents(".jqte").find(".jqte_editor")[0].innerHTML = ngModel.$viewValue || '';
                };
            });
        }
    };
});

appDirectives.directive('simpleHtml', function () {
    return function (scope, element, attr) {
        scope.$watch(attr.simpleHtml, function (value) {
            element.html(scope.$eval(attr.simpleHtml));
        });
    };
});

appDirectives.directive('formauto', function () {
    return function (scope, elem, attrs) {
        // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
        elem.prop('method', 'POST');

        // Fix autofill issues where Angular doesn't know about autofilled inputs
        if (attrs.ngSubmit) {
            setTimeout(function () {
                elem.unbind('submit').submit(function (e) {
                    e.preventDefault();
                    elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
                    scope.$apply(attrs.ngSubmit);
                });
            }, 0);
        }
    };
});