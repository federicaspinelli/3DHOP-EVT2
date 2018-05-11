(function () {
   console.log("caricato modulo openseadragonService");
   angular.module('evtviewer.openseadragonService', ["evtviewer.interface"])

      .service('imageViewerHandler', function (evtInterface, imageScrollMap) {

         var viewerHandler = this;

         viewerHandler.viewer = undefined;
         viewerHandler.scope = undefined;

         viewerHandler.setViewer = function (viewer) {
            viewerHandler.viewer = viewer;
         };
         viewerHandler.setScope = function (scope) {
            viewerHandler.scope = scope;
         };


         viewerHandler.open = function () {
            console.log("openHandler");
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            console.log("openHandler", oldBounds);
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0.1, 1, h);
            console.log(newBounds);
            viewerHandler.viewer.viewport.fitBounds(newBounds, true);
            //viewer.navigator.element.parentElement.parentElement.style.overflow = "visible";
            //viewer.navigator.element.parentElement.style.overflow = "visible";
            //viewer.navigator.element.style.overflow = "visible";
            //viewer.navigator.element.firstChild.style.overflow = "visible";
            //viewer.navigator.element.firstChild.children[0]  = "hidden"; 
            //viewer.navigator.element.firstChild.children[1]  = "hidden"; 
            //viewer.navigator.element.firstChild.firstChild.style.overflow = "hidden";
            console.log("element navigator", viewerHandler.viewer.navigator.element);
            //console.log("evtInterface", evtInterface);
            //console.log("scope", scope);
            //console.log("element", element);
            //console.log("scope.$parent", scope.$parent);
            //console.log("scope.$parent.$parent", scope.$parent.$parent.vm);


         };

         viewerHandler.home = function () {
            console.log('pigiato home');
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            var h = oldBounds.height / oldBounds.width;
            var newBounds = new OpenSeadragon.Rect(0, 0.1, 1, h);
            viewerHandler.viewer.viewport.fitBounds(newBounds, true);
         };

         viewerHandler.navigatorScroll = function (event) {
            console.log("navigator-scroll", evtInterface);
            console.log("navigator-scroll", event);
            if (event.scroll > 0) {
               console.log("scroll-in");
               //console.log("scope.$parent.$parent", scope.$parent.$parent.vm);
               //scope.$parent.$parent.vm.updateState('position',event.eventSource.viewport.getBounds());
               //    viewerHandler.scope.$apply(function () {
               //       evtInterface.updateState("currentPage", imageScrollMap.map(event.eventSource.viewport.getBounds()));
               //       console.log("in handler:", evtInterface.getState('currentPage'));
               //       //scope.$parent.$parent.vm.updateContent();
               //    });

            } else {
               console.log("scroll-out");
               //    viewerHandler.scope.$apply(function () {
               //       evtInterface.updateState("currentPage", imageScrollMap.map(event.eventSource.viewport.getBounds()));
               //       console.log("in handler:", evtInterface.getState('currentPage'));
               //       //scope.$parent.$parent.vm.updateContent();
               //    });
            }


         };

         viewerHandler.pan = function (event) {
            try {
               console.log("pan", event);
               //if (event.immediately === undefined) {
               var newY = event.center.y;
               var oldY = event.eventSource.viewport._oldCenterY;
               console.log("ok event pan", newY);
               console.log("ok viewer pan", oldY);
               // evento scroll verso il basso
               if (viewerHandler.viewer.viewport.getZoom() === 1) {
                  console.log("aggiorna testo");
                  var oldBounds = viewerHandler.viewer.viewport.getBounds();
                  if (newY > oldY) {
                     console.log("mostro riga sotto");
                     console.log("bounds:", oldBounds);
                     //angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN" + oldBounds + "</span>";
                     var newPage = imageScrollMap.mapDown(event.eventSource.viewport.getBounds());
                     var currPage = evtInterface.getState('currentPage');
                     if (newPage != currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", newPage);
                           console.log("in pan handler:", evtInterface.getState('currentPage'));
                           //scope.$parent.$parent.vm.updateContent();
                        });
                     }
                     //evento scroll verso l'alto    
                  } else if (newY < oldY) {
                     console.log("mostro riga sopra");
                     console.log("bounds:", oldBounds);
                     //angular.element(document).find('.box-text')[1].innerHTML = "<span> PRENDERE IL TESTO IN" + oldBounds + "</span>";
                     var newPage = imageScrollMap.mapUP(event.eventSource.viewport.getBounds());
                     var currPage = evtInterface.getState('currentPage');
                     if (newPage != currPage) {
                        viewerHandler.scope.$apply(function () {
                           evtInterface.updateState("currentPage", newPage !== '' ? newPage : currPage);
                           console.log("in pan handler:", evtInterface.getState('currentPage'));
                           //scope.$parent.$parent.vm.updateContent();
                        });
                     }
                  }
               }

               //event.stopBubbling = true;
            } catch (err) {
               console.log('error in pan', err);

            }

         };

         viewerHandler.updateViewerBounds = function (page) {
            console.log("updateViewerBounds: ", viewerHandler.viewer, page);
            var oldBounds = viewerHandler.viewer.viewport.getBounds();
            console.log("updateViewerBounds: ", oldBounds);
            if (!imageScrollMap.isInBounds(oldBounds.y, page)) {
               console.log('updateViewerBounds', page);
               imageScrollMap.updateBounds(viewerHandler.viewer, page);
            }

         }

         viewerHandler.highlightOverlay = function(zone){
            console.log('in highlight Overlay: ', zone);
            if(!zone) throw "problem in zone data extraction";
            
            try {
                  viewerHandler.viewer.removeOverlay("line-overlay");
            } catch (error) {
                  console.error('no line overlay', error);
            }
            var rectObj = convertZoneToOSD(zone);
            var elt = document.createElement("div");
            elt.id = "line-overlay";
            elt.className = "highlight";
            viewerHandler.viewer.addOverlay({
                element: elt,
                location: rectObj
            });

         }

         viewerHandler.turnOffOverlay = function(){
            try {
                  viewerHandler.viewer.removeOverlay("line-overlay");
            } catch (error) {
                  console.error('no line overlay', error);
            }
         }

         function convertZoneToOSD(zone){
               // TODO, This is just a test
            var tmp = {};
            tmp.x = _(zone.ulx);
            tmp.y = _(zone.uly);
            tmp.width = _(zone.lrx - zone.ulx);
            tmp.hight = _(zone.lry - zone.uly);
            console.log("in convert zone to OSD", tmp);
            return new OpenSeadragon.Rect(tmp.x/3500, tmp.y/3500, tmp.width/3500, tmp.hight/3500);
         }

         function _(value){
               return value;
         }


         viewerHandler.testFun = function () {
            console.log("testFunction: ", viewerHandler);
            return "test ok";
         };

         console.log("caricato servizio  imageViewerHandler");

      });

})();