<?php

namespace backend\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\DlReport;

/**
 * DlReportSearch represents the model behind the search form about `backend\models\DlReport`.
 */
class DlReportSearch extends DlReport
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'request_id', 'master_id', 'transaction_id', 'orginal_price', 'price', 'promotion', 'charge_count', 'resultcode'], 'integer'],
            [['agent_id', 'timestamp', 'action', 'msisdn', 'product_code', 'channel', 'mo', 'created_at', 'updated_at'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = DlReport::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'request_id' => $this->request_id,
            'master_id' => $this->master_id,
            'transaction_id' => $this->transaction_id,
            'orginal_price' => $this->orginal_price,
            'price' => $this->price,
            'promotion' => $this->promotion,
            'charge_count' => $this->charge_count,
            'resultcode' => $this->resultcode,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ]);

        $query->andFilterWhere(['like', 'agent_id', $this->agent_id])
            ->andFilterWhere(['like', 'timestamp', $this->timestamp])
            ->andFilterWhere(['like', 'action', $this->action])
            ->andFilterWhere(['like', 'msisdn', $this->msisdn])
            ->andFilterWhere(['like', 'product_code', $this->product_code])
            ->andFilterWhere(['like', 'channel', $this->channel])
            ->andFilterWhere(['like', 'mo', $this->mo]);

        return $dataProvider;
    }
}
