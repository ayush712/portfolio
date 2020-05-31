import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  ngAfterViewInit() {
    var clientHeight = document.documentElement.clientHeight;
    Array.from(document.querySelectorAll('[data-dest]')).forEach(function (elem) {
      elem.addEventListener('click', function (event: any) {
        document.getElementById(event.currentTarget.dataset.dest).scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
    document.addEventListener('scroll', function () {
      var activeSectionId = findActiveLink().elem;
      removeActiveLink();
      setActiveLink(activeSectionId);
    });
    function findActiveLink() {
      var ratios = [];
      Array.from(document.querySelectorAll('[section]')).forEach(function (elem) {
        var boundingRect = elem.getBoundingClientRect();
        var height = boundingRect.height;
        var top = boundingRect.top;
        var bottom = boundingRect.bottom;
        var ratio = 0;
        if (bottom <= 0) {
          ratio = 0;
        } else if (top > clientHeight) {
          ratio = 0;
        } else {
          if (top <= 0) {
            if (bottom > clientHeight) {
              ratio = 1;
            } else {
              ratio = bottom / height;
            }
          } else if (top > 0) {
            if (bottom > clientHeight) {
              ratio = (height - (bottom - clientHeight)) / height;
            } else {
              ratio = 1;
            }
          }
        }
        ratios.push({ elem: elem.id, ratio: ratio });
      });
      return ratios.reduce(function (current, elem) {
        if (current.ratio <= elem.ratio) {
          current = elem;
        }
        return current;
      }, { ratio: 0, elem: '' });
    }
    function removeActiveLink() {
      var activeLink = document.querySelector('nav li.active');
      if (activeLink) {
        activeLink.classList.remove('active');
      }
    }
    function setActiveLink(id) {
      document.querySelector('nav li[data-dest=' + id + ']').classList.add('active');
    }
    var options = {
      threshold: 1
    }
    var observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach((entry: any) => {
        if (entry.intersectionRatio > 0) {
          JSON.parse(entry.target.dataset.animate).className.split(',').forEach((className) => {
            entry.target.classList.add(className.trim());
          });
          // observer.unobserve(entry.target);
        }
      })
    }, options);
    Array.from(document.querySelectorAll('[data-animate]')).forEach((elem) => {
      observer.observe(elem);
    });
  }
}
