var app = new Vue({
    el: '#app',
    data:{
        items:null,
        keyword:'',
        message:''
    },
    // 監視プロパティ
    watch:{
        keyword:function(newkeyword,oldkeyword){
            // console.log(newkeyword)
            // keywordの値が変わるたびAPI読んでいてはAPIに負荷かかるので、指定時間内に同じイベントが発生すると処理実行せず、発生しなければ実行する。
            this.message = 'Wating for you to stop typing...'
            this.debouncedGetAnswer()
        }
    },
    // mountedでもいい。domにアクセスしないならcreated:が速い。
    created:function(){
        // 動作確認用
        // this.keyword= 'JavaScrept'
        // this.getAnswer
        this.debouncedGetAnswer= _.debounce(this.getAnswer,1000)
    },
    methods:{
        getAnswer:function(){
            // keywordはユーザーが入力したもの、itemsはQiitaAPIの検索結果、messageはエラー時やローディングで使うメッセージ
            // キーワード（ユーザーが入力したもの）が空なら検索結果も空にして終了させる
            if(this.keyword === ''){
                this.items= null
                this.messege= ''
                return
            }
            this.message = 'Loading...'
            // アクシオスでビューインスタンスのプロパティにアクセスするためthisをローカル変数に入れておく（なぜだ?）
            var vm = this
            //  アクシオスAPI使うにあたりパラメーターをキーバリューの形式で用意しとく。1ページ目を表示、１ページあたり２０件、クエリにはキーワードを入れる
            var params = { page:1,per_page:20,query:this.keyword}
            // APIを叩く、パラメータ渡す
            axios.get('https://qiita.com/api/v2/items',{params})
            // APIから取得した値を利用
            .then(function(response){
                // デバック用にコンソール表示
                console.log(response)
                // dataのitemに結果を代入
                vm.items = response.data
            })
            // エラーメッセージをセット
            .catch(function(error){
                vm.message = 'Error!'+ error
            })
            // APIとの通信が終わったらメッセージをクリア
            .finally(function(){
                vm.message = ''
            })
        }

    }
})