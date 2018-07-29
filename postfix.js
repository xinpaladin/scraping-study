// 全局参数设置
var MAX_IS_COUPON = 0;

function createQRcodeLogo(container, type) {
    var height = (parseInt(container.css('height')) - 40) / 2 + 'px',
        width = (parseInt(container.css('width')) - 40) / 2 + 'px',
        margin = height + ' ' + width,
        logoImg = "/statics/book118/images/wxlogo.png";
    if (type === 1) {
        logoImg = "/statics/book118/images/qqlogo.png";
    }
    var logo = "<div style='position:absolute;left:0;top:0;width:40px;height:40px;background:url(" + logoImg + ");margin:" + margin + ";'></div>";
    container.css('position', 'relative');
    container.append(logo);
}

function placeholde(target) {
    $(target).val($(target).attr("datavalue")).css("color", '#666');
    $(target).focus(function () {
        if ($(this).val() == $(this).attr("datavalue")) {
            $(this).val("").css("color", '');
        }
    })
    $(target).blur(function () {
        if ($(this).val() == "" || $(this).val() == $(this).attr("datavalue")) {
            $(this).val($(target).attr("datavalue")).css("color", '#666');
        }
    })
}

/**
 * 填写过手机号码或邮箱自动发送邮件
 */
function hasAccount() {
    if (typeof (discountAccount) !== 'undefined' && discountAccount) {
        $("#newemail_box_email").val(discountAccount);
        $("#newD").trigger('click');
    }
    discountAccount = '';
}

function beforeLoginBuy(needMoney, userMoney) {
    var reData = checkUserHasDiscount(),
        discountId = 0,
        disMsg = '',
        needMoneyEn, needMoneyNot;
    if (reData.id) {
        disMsg = ' (原价' + needMoney + '金币，已享受' + reData.discount * 10 + '折优惠)';
        discountId = reData.id;
        needMoney = Math.ceil(needMoney * parseFloat(reData.discount) * 10) / 10;
    }
    // 金币足够需要花费
    needMoneyEn = Math.ceil(needMoney * 10) / 10;
    // 金币不足需要充值
    needMoneyNot = Math.ceil((needMoney - userMoney) * 10) / 10;
    return {
        needMoney: needMoney,
        disMsg: disMsg,
        discountId: discountId,
        needMoneyEn: needMoneyEn,
        needMoneyNot: needMoneyNot
    };
}
// 已登录检测
function checkUserHasDiscount(ele) {
    var reData;
    $.ajax({
        url: '/index.php?g=Home&m=Ajax&a=getDiscountIfExists',
        type: 'POST',
        data: {
            type: 2,
            account: ''
        },
        async: false,
        success: function (data) {
            if (!(data instanceof Object)) {
                data = $.parseJSON(data);
            }

            reData = data.data;
        }
    });
    return reData;
}

function isIe(textUrl, type) {
    if (!type) {
        type = 0;
    } else {
        type = 1;
    }
    var brower = $.browser,
        imgContainer = '',
        re = {
            imgContainer: imgContainer,
            isIe: false,
            deUrl: ''
        };

    if (brower.msie) {
        imgContainer = "<img src='/index.php?g=Home&m=Visitor&a=generateQRcode&url=" + textUrl + "&type=" + type + "' width='200px' height='200px'>";
        re.imgContainer = imgContainer;
        re.isIe = true;
    } else {
        re.deUrl = decodeURIComponent(textUrl);
    }
    return re;
}
/**
 * 消失方法
 *
 */
function dialogHide() {
    var $viewBg = $('.view-dialogBg'),
        $viewDialog = $(".view-dialog");
    $viewBg.fadeOut(500);
    $viewDialog.fadeOut(400);
}

/**
 * 添加默认图片
 * 1.如果imgSrc为空 则为imgSrc设置默认图片，否则直接输出；
 *
 */
function domImg(imgSrc) {
    var $viewPlace = $(".viewPlace"),
        imgStr = '<img src="' + imgSrc + '" alt="" class="viewImg">';
    if (imgSrc == '' || imgSrc == null || imgSrc == undefined) {
        imgSrc = '/Public/book118/images/no-pic.jpg';
        imgStr = '<img src="' + imgSrc + '" alt="很遗憾，此文档无图可预览。请点击“预览文档”开始预览,max文档赚钱网，上传文档可以赚钱啦。原创文档分成比例高达100%!" class="viewImg">';
        $viewPlace.append(imgStr);
    } else {
        $viewPlace.append(imgStr);
    }
}

/**
 *
 * 1.同意后加载 iframe方法;
 * 2.ifraddr 为iframe地址;
 * 3.flag 为开关  true:加载iframe,  false:不加载;
 *
 */
function domView(ifraddr, imgSrc, flag) {
    var $cid = $(".viewPlace").data('cid'),
        $mid = $(".viewPlace").data('mid');
    $.get('/index.php?g=Home&m=View&a=viewUrl', {
        mid: $mid,
        cid: ($("#feedback input[name=aid]").val())
    }, function (data) {
        ifraddr = data;

        var $viewPlace = $(".viewPlace"),
            domStr = '<iframe src="' + ifraddr + '" frameBorder=0 scrolling=yes width="685" height="530" name="ckframe"></iframe>';

        if (flag === true) {
            $viewPlace.children("img").remove();
            $viewPlace.append(domStr);
        } else {
            return;
        }
    });
}

/*2017-6-16 ie7-8添加placeholder*/
var JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        jQuery(':input[placeholder]').each(function (index, element) {
            var self = $(this),
                txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({
                position: 'relative',
                zoom: '1',
                border: 'none',
                background: 'none',
                padding: 'none',
                margin: 'none'
            }));
            var pos = self.position(),
                h = self.outerHeight(true),
                paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({
                position: 'absolute',
                left: '50px',
                top: pos.top,
                height: '26px',
                lineHeight: '26px',
                paddingLeft: paddingleft,
                color: '#aaa'
            }).appendTo(self.parent());
            self.focusin(function (e) {
                holder.hide();
            }).focusout(function (e) {
                if (!self.val()) {
                    holder.show();
                }
            });
            holder.click(function (e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
/*
 * 2016-12-7 增加文档判断
 * 2016-12-9 增加标题文档显示
 */
function judge() {
    var tit = $(".doc h1").html().split('<span')[0],
        ppt = '全屏预览 [' + tit + '] --欢迎下载，PPT加载较慢，建议等半分钟后再预览（请勿关闭本窗口）。如预览无反应,请关闭预览后重试打开！',
        doc = '全屏预览 [' + tit + '] --欢迎下载，永久保存到你电脑。如预览无反应,请关闭预览后重试打开！';

    var judge = '';

    var strRegex = new RegExp('.ppt'); //用于验证ppt
    if (strRegex.test(tit)) {
        judge = ppt;
        return judge
    } else {
        judge = doc;
        return judge;
    }
}
/*
 * 全屏方法
 */
function openFull(url) {
    var openUrl,
        judgeText = judge();
    // ogm 2017-05-27添加判断
    var tmp_doc_aid;
    if ($("input[name=tmp_doc_aid]").val()) {
        tmp_doc_aid = $("input[name=tmp_doc_aid]").val();
    } else {
        tmp_doc_aid = $("#feedback input[name=aid]").val();
    }
    if (tmp_doc_aid > 5000000) $.getJSON('/index.php?m=Ajax&a=preview&aid=' + tmp_doc_aid);
    $.ajax({
        url: '/index.php?g=Home&m=View&a=viewUrl',
        type: 'GET',
        data: {
            cid: tmp_doc_aid,
            flag: 1
        },
        async: false,
        success: function (data) {
            openUrl = data;
        }
    });

    if (openUrl == 'false') {
        var codeHtml = '<div style="margin: 20px;text-align: center">' +
            '<label style="font-size:16px;">请输入验证码：</label>' +
            '<input type="text" name="code" id="v_code" style="width:80px;">&nbsp;&nbsp;&nbsp;' +
            '<img src="/index.php?m=Public&a=verify" class="yzmImg" onclick="javascript:yzmTime();">&nbsp;&nbsp;' +
            '<div style="margin-top: 20px;"><input type="button" value="提 交" id="subCode" style="background: #2c9cf0;color:#fff;padding: 3px 10px;border-radius: 3px;border:1px solid #2c9cf0;font-size:14px;">' +
            '</div></div>';
        layer.open({
            type: 1,
            title: '预览过于频繁，请输入验证码',
            fixed: true,
            area: ['380px', '200px'],
            offset: '10%',
            content: codeHtml,
            success: function (layero, index) {
                $("#subCode").click(function () {
                    if ($("#v_code").val() == '') {
                        layer.msg('请输入验证码');
                        return false;
                    }
                    $.ajax({
                        url: '/index.php?g=Home&m=View&a=viewUrl',
                        type: 'GET',
                        data: {
                            cid: tmp_doc_aid,
                            code: $("#v_code").val()
                        },
                        async: false,
                        success: function (data) {
                            if (data == 'error') {
                                layer.msg('验证码输入错误');
                            } else {
                                openUrl = data;
                                layer.closeAll();
                                getViewHtml(judgeText, openUrl);
                            }
                        }
                    });
                })
            }
        });
    } else if (openUrl == 'error') {
        layer.msg('验证码输入错误');
    } else {
        getViewHtml(judgeText, openUrl);
    }
}

function getViewHtml(judgeText, openUrl) {
    var dom = '<dl class="iframe-loading"><dt><img src="/Public/book118/images/iframe-loading.gif" alt="loading"/></dt><dd class="t">加载中，请稍后...</dd><dd class="c">如超过10秒未动，请按F5键刷新本页面后重试</dd></dl>' +
        '<iframe id="layer_view_iframe" scrolling="auto" allowtransparency="true" frameborder="0" src="' + openUrl + '" width="100%" height="100%"></iframe>' +
        '<div class="newDown"><img src="/Public/book118/images/down.gif" alt="下载该文档" title="下载该文档"></div>' +
        '<div class="newClaim"><img src="/Public/book118/images/claim.png" alt="认领该文档" title="认领该文档"></div>' +
        '<div class="newDown-t"><img src="/Public/book118/images/down.gif" alt="下载该文档" title="下载该文档"></div>' +
        '<div class="newClaim-t"><img src="/Public/book118/images/claim.png" alt="认领该文档" title="认领该文档"></div>';
    var openUrl = '//view42.book118.com/?readpage=4pwfu0xGrLEfhFLci8JqyQ==&furl=o4j9ZG7fK96zHppV4DUexOxagGZ1DhJUa7kK78fc3bcGinjLD50hHs7P6IWpE_UPJ1H3C7c4bF2GPd1Aj_StXzSNhJD0LOdUufM6avF9t8U=&n=1';
    layer.open({
        type: 1,
        title: judgeText,
        fixed: true,
        area: ['85%', '90%'],
        shade: 0.6,
        moveOut: true,
        shadeClose: true,
        move: '.layui-layer-title',
        anim: 2,
        content: dom,
        success: function (layero, index) {
            //获取文档类别，如果是普通文档就让警告框显示；
            if (typeof docTypeModel == 'undefined' || docTypeModel != 1) {
                var $newAlert = $('<div class="newAlert" id="layer_newAlert">' +
                    '<p>提示：本文档内容均由网友上传和审核，内容可能有不完整，瑕疵等问题，本站不做品质保证，一旦下载本网概不退款。</p>' +
                    '<a href="javascript:;">关闭 (<span>8</span>s)</a>' +
                    '</div>');
                $('#layer_view_iframe').after($newAlert);
                var time = 8;
                var timer = setInterval(function () {
                    if (time == 0) {
                        clearInterval(timer);
                        $newAlert.find('a').html('关闭提示');
                        $newAlert.find('a').on('click', function () {
                            $('#layer_newAlert').remove();
                        });
                    } else {
                        $newAlert.find('a').find('span').text(time--);
                    }
                }, 1000);
            }
            $(".layui-layer-shade").bind('contextmenu', function (e) {
                return false;
            });
            var iframe = document.getElementById('layer_view_iframe');
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    $('dl.iframe-loading').remove();
                });
            } else {
                iframe.onload = function () {
                    $('dl.iframe-loading').remove();
                };
            }
            $('.newDown,.newDown-t').on('click', function () {
                var url = window.location.href;
                var id = 0;
                if (url.indexOf("&") == -1) {
                    var patton = '([0-9]+)\.shtm';
                    id = url.match(patton);
                } else {
                    var patton = 'id\=([0-9]+)';
                    id = url.match(patton);
                }
                id = id[1];
                //downloadDoc(id);
                viewLogin.viewDl(id);
            });
            $('.newClaim,.newClaim-t').on('click', function () {
                claimStep1();
            });
            $("#book-newImg").unbind("click");
            //根据标题判断文档类型，设置下载按钮位置
            if (judgeText.indexOf('doc') > -1) { //doc
                $('.layui-layer').find('.newDown-t').css({
                    'marginLeft': '-460px',
                    'top': '61px'
                });
                $('.layui-layer').find('.newDown').css({
                    'marginRight': '-439px',
                    'top': '61px'
                });
                $('.layui-layer').find('.newClaim-t').css({
                    'marginLeft': '-460px',
                    'top': '280px'
                });
                $('.layui-layer').find('.newClaim').css({
                    'marginRight': '-440px',
                    'top': '280px'
                });
            } else if (judgeText.indexOf('ppt') > -1) { //ppt
                $('.layui-layer').find('.newDown-t').css({
                    'marginLeft': '-530px',
                    'top': '51px'
                });
                $('.layui-layer').find('.newDown').css({
                    'marginRight': '-528px',
                    'top': '51px'
                });
                $('.layui-layer').find('.newClaim-t').css({
                    'marginLeft': '-530px',
                    'top': '270px'
                });
                $('.layui-layer').find('.newClaim').css({
                    'marginRight': '-529px',
                    'top': '270px'
                });

            } else { //pdf
                $('.layui-layer').find('.newDown-t').css({
                    'marginLeft': '-501px',
                    'left': '50%',
                    'top': '61px'
                });
                $('.layui-layer').find('.newDown').css({
                    'marginRight': '-482px',
                    'top': '61px'
                });
                $('.layui-layer').find('.newClaim-t').css({
                    'marginLeft': '-501px',
                    'left': '50%',
                    'top': '280px'
                });
                $('.layui-layer').find('.newClaim').css({
                    'marginRight': '-483px',
                    'top': '280px'
                });
            }
        }
    });
}

/*
 * 2016-11-24 增加弹层登录方法
 *
 */
function viewDl(pangeumber, readnumber, readmoney, docid) {

    var str = '<div class="viewDl">' +
        '<dl>' +
        '<dt>登录名:</dt>' +
        '<dd><input type="text" id="name" placeholder="请输入您的账号" value="" /></dd>' +
        '</dl>' +
        '<dl>' +
        '<dt>密 码:</dt>' +
        '<dd><input type="password" id="password" placeholder="请输入您的密码" value="" /></dd>' +
        '</dl>' +
        '<dl>' +
        '<dt>验 证 码:</dt>' +
        '<dd><input type="text" id="yzm" placeholder="验证码" value="" class="yz" /> <img src="/index.php?m=Public&a=verify" onclick="javascript:yzmTime();" align="bottom" alt="验证码" class="yzmImg"><a href="javascript:yzmTime();">点击更换</a></dd>' +
        '</dl>' +
        '<div class="viewDlbtn"><a href="javascript:;" class="viewDlbtnA">登 录</a> <span><a href="/account/findpassword">忘记密码？</a></span></div>' +
        '<div class="quickDl">' +
        '<h3>您可以使用这些方式快速登录：</h3>' +
        '<div class="quickDlcontent">' +
        '<a href="/openid/redirect.php?t=qzone" target="_blank" title="qq登录"><img src="/Public/book118/images/qq.png" alt="qq登录"></a><a href="/openid/redirect.php?t=fastlogin" target="_blank" title="支付宝登录"><img src="/Public/book118/images/zfb.png" alt="支付宝登录"></a><a href="/openid/redirect.php?t=taobao" target="_blank" title="淘宝登录"><img src="/Public/book118/images/tb.png" alt="淘宝登录"></a>' +
        '</div>' +
        '</div>' +
        '</div>';

    layer.open({
        type: 1,
        title: ['阅读请先登录'],
        fixed: true,
        area: ['360px', '350px'],
        shade: 0.6,
        shadeClose: true,
        move: '.layui-layer-title',
        anim: 2,
        content: str,
        success: function (layero, index) {
            //调用
            $(".viewDlbtnA").on('click', function () {
                var name = $("#name").val();
                var pwd = $("#password").val();
                var vdcode = $("#yzm").val();
                if (name == '') {
                    layer.msg('用户名不能为空');
                } else if (pwd == '') {
                    layer.msg('密码不能为空');
                } else if (vdcode == '') {
                    layer.msg("验证码不能为空");
                } else {
                    $.post('/index.php?m=Public&a=doLogin', {
                        userid: name,
                        pwd: pwd,
                        vdcode: vdcode
                    }, function (date) {
                        date = eval('(' + date + ')');
                        if (date.status == 0) {
                            layer.closeAll();
                            $.post('/index.php?g=Home&m=View&a=getDocStatus', {
                                id: docid
                            }, function (d) {
                                d = $.parseJSON(d);
                                if (parseInt(d.status) != 4) {
                                    $.post('/index.php?g=Home&m=View&a=getInformation', {
                                        cid: docid
                                    }, function (data) {
                                        data = $.parseJSON(data);
                                        viewPay(pangeumber, readnumber, readmoney, data.money, docid);
                                    });
                                } else {
                                    $(".view-desc-content a").attr("href", "javacript:;");
                                    $(".view-desc-content a img").attr("src", "/Public/book118/images/view-pay2.png");
                                    attrImg($(".view-desc-content a img"), '/Public/book118/images/view-pay2.png');
                                }
                            });

                        } else {
                            layer.msg(date.info);
                        }
                    });
                }
            })
        }
    });
}
/*
 * 添加验证码
 *
 * */
function yzmTime() {
    var $yzmImg = $('.yzmImg'),
        $yzmtTime = new Date(),
        $yzmSrc = '/index.php?m=Public&a=verify&',
        $yzmD = '';
    $yzmD += $yzmtTime.getDate() + $yzmtTime.getHours() + $yzmtTime.getMinutes() + $yzmtTime.getSeconds();
    $yzmSrc += $yzmD;
    $yzmImg.attr("src", $yzmSrc);
}

/*
 * 2016-11-24 增加付费阅读信息
 *
 *
 * */
function viewPay(pageumber, readnumber, readmoney, usermoney, docid) {
    var payStr = '<div class="viewPay">' +
        '<div class="viewPaytext">' +
        '<div>该文档共有<strong>' + pageumber + '</strong>页,可免费阅读<strong>' + readnumber + '</strong>页</div>' +
        '<div>阅读全文则需要<strong>' + readmoney + '</strong>金币<span>(10金币=1元)</span></div>' +
        '<div class="viewPay-btn"><a href="javascript:void(0)" onclick="ReadByMoney(' + readmoney + ')">立即支付</a></div>' +
        '<div>您当前的金币余额为：<strong>' + usermoney + '</strong></div>';

    if (parseInt(usermoney) < parseInt(readmoney)) {
        payStr += '<div>您余额不足以支付本次阅读：<a href="/index.php?m=Recharge&g=User&a=index"><strong>请充值</strong></a></div>' +
            '<div><strong>该文档为原创文档，已通过本站身份证和原创保证！</strong></div>' +
            '</div>' +
            '</div>';
    } else {
        payStr += '<div><strong>该文档为原创文档，已通过本站身份证和原创保证！</strong></div>' +
            '</div>' +
            '</div>';
    }
    layer.open({
        type: 1,
        title: ['阅读付费'],
        fixed: true,
        area: ['360px', 'auto'],
        shade: 0.6,
        shadeClose: true,
        move: '.layui-layer-title',
        anim: 2,
        content: payStr,
        success: function (layero, index) {}
    });
}

function userlogin(pangeumber, readnumber, readmoney, docid) {
    $.post('/index.php?g=Home&m=View&a=checkUser', {}, function (date) {
        date = eval('(' + date + ')');
        if (parseInt(date.status) == 1) {
            //获取用户购买情况
            $.post('/index.php?g=Home&m=View&a=getDocStatus', {
                id: docid
            }, function (d) {
                d = $.parseJSON(d);
                if (parseInt(d.status) != 4) {
                    $.post('/index.php?g=Home&m=View&a=getInformation', {
                        cid: docid
                    }, function (data) {
                        data = $.parseJSON(data);
                        viewPay(data.pagenumber, data.readnumber, data.readmoney, data.money, data.id);
                    });
                } else {
                    $(".view-desc-content a").attr("href", "javacript:;");
                    $(".view-desc-content a img").attr("src", "/Public/book118/images/view-pay2.png");
                    attrImg($(".view-desc-content a img"), '/Public/book118/images/view-pay2.png');
                }
            });

        } else {
            viewDl(pangeumber, readnumber, readmoney, docid);
        }
    });
}

/**
 * 增加判断article.css文件
 *
 */
function isInclude() {
    var $link = document.getElementsByTagName('link');
    var reg = /jsswf.book118/;
    for (var i = 0; i < $link.length; i++) {
        if (reg.test($link[i].href)) {
            return true;
        }
    }
    return false;
}

/*
 * 鼠标移动改变图片
 * @param el 节点
 * @param src  移动上需要改变的图片
 */
function attrImg(el, src) {
    if (el.length == 0) return;
    var beforeSrc = el.attr('src');
    el.hover(function () {
        el.attr('src', src);
    }, function () {
        el.attr('src', beforeSrc);
    });
}

var showAsk = function () {
    // var url = 'http://ask.book118.com/question/notice.html';
    // if (typeof aid !== 'undefined') {
    //     url += '?docid=' + aid; 
    // }
    // window.location.href = url;
    zt._init();
}
var clickLazyScript = function (_src, callback, _href) {
    var d = '<div id="click_lazy_script"><img src="/Public/book118/images/loading.gif"/></div>';
    $('body').append(d);
    setTimeout(function () {
        var _script = document.createElement("script");
        _script.type = "text/javascript";
        _script.src = _src;
        document.getElementsByTagName('head')[0].appendChild(_script);
        if (_href) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = _href;
            document.getElementsByTagName('head')[0].appendChild(css);
        }
        if (! /*@cc_on!@*/ 0) {
            //Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload
            _script.onload = function () {
                $('#click_lazy_script').remove();
                callback();
            }
        } else {
            //IE6、IE7 support js.onreadystatechange
            _script.onreadystatechange = function () {
                if (_script.readyState == 'loaded' || _script.readyState == 'complete') {
                    $('#click_lazy_script').remove();
                    callback();
                }
            }
        }
    }, 500)
    return false;
}
var lazyScript = function (_src, callback, _href) {
    var _script = document.createElement("script");
    _script.type = "text/javascript";
    _script.src = _src;
    document.getElementsByTagName('head')[0].appendChild(_script);
    if (_href) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = _href;
        document.getElementsByTagName('head')[0].appendChild(css);
    }
    if (! /*@cc_on!@*/ 0) {
        //Firefox2、Firefox3、Safari3.1+、Opera9.6+ support js.onload
        _script.onload = function () {
            callback();
        }
    } else {
        //IE6、IE7 support js.onreadystatechange
        _script.onreadystatechange = function () {
            if (_script.readyState == 'loaded' || _script.readyState == 'complete') {
                callback();
            }
        }
    }
    return false;
}
/*
 * 调用
 */
$(function () {
    //判断加载 article.css
    if (isInclude()) {
        var $link = document.createElement('link');
        $link.href = "/statics/book118/css/article.css?20180726";
        $link.rel = "stylesheet";
        $link.type = "text/css";
        document.getElementsByTagName('head')[0].appendChild($link);
    }
    //判断添加qrcode.js
    if (typeof (QRCode) == 'undefined') {
        var scp = document.createElement('script');
        scp.type = "text/javascript";
        scp.src = "/Public/js/qrcode.min.js";
        document.getElementsByTagName('head')[0].appendChild(scp);
    }
    //判断添加layer.js
    if (typeof (side_customer) == 'undefined') {
        lazyScript('/Public/book118/js/side-customer/customer.js?v=20180704', function () {
            side_customer.init();
        }, '/Public/book118/js/side-customer/customer.css?v=20180704');
    } else {
        side_customer.init();
    }
    //判断添加第四范式
    //2016-12-8 增加付费状态取消显示“我要付费按钮”
    var url = location.href;
    var id = 0;
    if (url.indexOf("&") == -1) {
        var patton = '([0-9]+)\.shtm';
        id = url.match(patton);
    } else {
        var patton = 'id\=([0-9]+)';
        id = url.match(patton);
    }
    if (id == null) {
        id = 0;
    } else {
        id = id[1]
    }
    if (id > 0) {
        if (typeof (paradigm) == 'undefined') {
            lazyScript('/Public/book118/js/paradigmsdk.js?v=20180614', function () {
                paradigm.init();
            });
        } else {
            paradigm.init();
        }
        var getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return decodeURI(arr[2]);
            else
                return null;
        }
        var ckey = 'a_' + id;
        var hit = getCookie(ckey);
        if (!hit) {
            $.ajax({
                'url': '/index.php?m=Ajax&a=docHits&aid=' + id,
                'type': 'GET',
                'dataType': 'text',
                'timeout': 2000,
                'success': function (d) {}
            });
        }
    }
    //判断添加自动邮箱补全emailAutoComplate.js
    if (typeof (mailAutoComplete) == 'undefined') {
        var mailAuto = document.createElement('script');
        mailAuto.type = "text/javascript";
        mailAuto.src = "/Public/book118/js/emailAutoComplate.js";
        document.getElementsByTagName('body')[0].appendChild(mailAuto);
    }
    //加载更多操作按钮
    if (typeof (readmore) == 'undefined') {
        lazyScript('/Public/book118/js/readmore/js/readmore.js?v=20180716', function () {
            readmore.init();
        }, '/Public/book118/js/readmore/css/readmore.css?v=20180716');
    } else {
        readmore.init();
    }
    if (typeof (max_relevant) == 'undefined') {
        lazyScript('/Public/book118/js/relevant/relevant.js?v=20180720', function () {
            max_relevant.init();
        }, '/Public/book118/js/relevant/relevant.css?v=20180720');
    } else {
        max_relevant.init();
    }
    //判断添加layer.js
    if (typeof (layer) == 'undefined') {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/statics/book118/js/layer/layer.js";
        document.getElementsByTagName('body')[0].appendChild(script);
    }
    //下载按钮移动改变
    var $el = $('#v-toolbar-download').find('img');
    attrImg($el, '/Public/book118/images/view_btn_down2.png');

    //全屏按钮移动改变
    var $full = $('#full').find('img');
    attrImg($full, '/Public/book118/images/full2.png');

    //我要付费阅读按钮移动改变
    var $payBtn = $('.view-desc-content').find('img');
    attrImg($payBtn, '/Public/book118/images/view-pay3.png');

    //充值监听
    $('body').append("<input type='hidden' id='payStatus' value='0' >");

    var dataUrl = $(".viewPlace").data('url'),
        dataId = $(".viewPlace").data('id');
    // 预览区js
    var $viewImg = $(".viewPlace").data('img'),
        $viewIframe = $(".viewPlace").data('iframe');
    var ifraddr = dataUrl, //iframe地址
        imgSrc = $viewImg, //默认图片地址
        flag = false; //开关

    domImg(imgSrc); //加载默认图片
    if ($('img.viewImg').length > 0) {
        $('img.viewImg').error(function () {
            $(this).attr('src', "/Public/book118/images/no-pic.jpg").attr('alt', '很遗憾，此文档无图可预览。请点击“预览文档”开始预览,max文档赚钱网，上传文档可以赚钱啦。原创文档分成比例高达100%!');
        });
    }
    $.ajax({
        url: '/index.php?g=Home&m=View&a=getDocStatus',
        type: "GET",
        data: {
            id: id
        },
        success: function (data) {
            data = $.parseJSON(data);
            if (parseInt(data.status) == 4) {
                $(".view-desc-content a").attr("href", "javacript:;");
                $(".view-desc-content a img").attr("src", "/Public/book118/images/view-pay2.png");
                attrImg($(".view-desc-content a img"), '/Public/book118/images/view-pay2.png');
            }
        }

    });
    //同意按钮事件
    $(".viewPlace .view-dialog-btn a").on("click", function () {
        flag = true;
        openFull(ifraddr);

    });

    //关闭按钮添加事件
    $(".view-dialog h3 span").on('click', function () {
        dialogHide(); // 消失方法
    });

    //全屏
    $('#full').on('click', function () {
        openFull(ifraddr); //全屏方法
    });
    var claimVal_a = $("#claim").val();
    //替换详情也文本

    if (claimVal_a != 1) {
        $("#ad_renqi").html('限特殊用户可见');
        $("#ad_xiazaicishu").html('限特殊用户可见');
        $("#ad_shoucang").html('限特殊用户可见');
    } else {
        $('<style>.needmoney:before{content:\'' + $('.needmoney').html() + '\'}</style>').appendTo('head');
        $(".needmoney").css({
            'width': '34px',
            height: '20px'
        })
    }


    //全屏
    $('.full_class').on('click', function () {
        openFull(ifraddr, 'newwindow'); //全屏方法
    });
    if (typeof (zt) == 'undefined') {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/static/promote/js/promote.js";
        document.getElementsByTagName('body')[0].appendChild(script);
    }
    var tmp_doc_aid;
    if ($("input[name=tmp_doc_aid]").val()) {
        tmp_doc_aid = $("input[name=tmp_doc_aid]").val();
    } else {
        tmp_doc_aid = $("#feedback input[name=aid]").val();
    }
    if (tmp_doc_aid) {
        $.ajax({
            url: '/index.php?g=Api&m=newPayView&a=getDocType',
            type: 'GET',
            data: {
                aid: tmp_doc_aid
            },
            async: false,
            success: function (data) {
                if (typeof data !== 'object') {
                    data = $.parseJSON(data);
                }
                if (data.status !== 1) {
                    layer.msg(data.info);
                } else {
                    if (typeof (payReading) == 'undefined') {
                        setTimeout(function () {
                            lazyScript('/Public/book118/js/payReading/payReading.js?v=2018010701', function () {
                                payReading.initialization(data.data);
                            }, '/Public/book118/js/payReading/payReading.css?v=2018010701');
                        }, 100);
                    }
                }
            }
        });
    }
});
var claimStep1 = function () {
    if (typeof (claimStep) == 'undefined') {
        clickLazyScript('/Public/book118/js/claim.js?v=20180116', function () {
            claimStep();
        });
    } else {
        claimStep();
    }
}
var viewLogin = {
    viewDl: function (id) {
        if (typeof (viewLogin_hasload) == 'undefined') {
            clickLazyScript('/Public/book118/js/viewLogin/viewLogin.js?v=20180717', function () {
                viewLogin.viewDownload(id);
            });
        } else {
            viewLogin.viewDownload(id);
        }
    }
}